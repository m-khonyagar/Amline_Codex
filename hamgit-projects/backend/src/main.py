import logging
from contextlib import asynccontextmanager

import sentry_sdk
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import BackgroundTasks, Depends, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from prometheus_fastapi_instrumentator import Instrumentator
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

from account.adapters.orm.mappers import start_mappers as start_account_mappers
from account.entrypoints.routes import router as account_router
from advertisement.adapters.orm.mappers import start_mappers as start_ads_mappers
from advertisement.entrypoints.router import router as advertisement_router
from contract.adapters.orm.mappers import start_mappers as start_contract_mappers
from contract.entrypoints.routes import router as contract_router
from core import exc_handlers, exceptions, settings
from core.database import DATABASE_ENGINE
from core.helpers import get_now
from core.logger import Logger
from core.middlewares.elastic_search import ElasticIpLoggerMiddleware
from crm.adapters.orm.mappers import start_mappers as start_crm_mappers
from crm.entrypoints.routes import router as crm_router
from crm.service_layer.services.archive_manager import ArchiveManager
from financial.adapters.orm.mappers import start_mappers as start_financial_mappers
from financial.entrypoints.router import router as financial_router
from financial.service_layer.event_handlers.wallet_transactions_verifier import (
    handle_stale_wallet_transactions,
)
from shared.adapters.orm.mappers import start_mappers as start_storage_mappers
from shared.entrypoints.routes import router as shared_router
from shared.entrypoints.routes.eitaa_routes import router as eitaa_router
from shared.entrypoints.routes.kenar_divar_routes import router as kenar_divar_router
from shared.service_layer.services.scheduled_messages.payment_alert_message import (
    PaymentAlertMessage,
)


if settings.APP_ENV == "production":
    sentry_sdk.init(
        dsn="https://1c89755d916d8e4bc420c016777b9d6e@sentry.hamravesh.com/8147",
        traces_sample_rate=1.0,
    )


logger = Logger("main")

API_KEY_NAME = "Authorization"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


scheduler = AsyncIOScheduler()


def start_scheduler():
    scheduler.add_job(PaymentAlertMessage.send_messages, trigger=CronTrigger(hour=6, minute=30), id="payment_alert")
    scheduler.add_job(
        ArchiveManager.archive_old_files_and_ads,
        trigger=CronTrigger(hour=5, minute=30),
        id="archive_old_files_and_ads",
    )

    scheduler.start()


def stop_scheduler():
    scheduler.shutdown()


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Start and stop the application's lifespan events."""
    start_account_mappers()
    start_storage_mappers()
    start_contract_mappers()
    start_financial_mappers()
    start_ads_mappers()
    start_crm_mappers()
    start_scheduler()

    yield

    stop_scheduler()
    DATABASE_ENGINE.dispose()


app = FastAPI(
    lifespan=lifespan,
    security=api_key_header,
    openapi_url="/openapi.json" if settings.DEBUG else None
)

if not settings.DEBUG:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[
            LoggingIntegration(level=logging.ERROR, event_level=logging.ERROR),
            StarletteIntegration(transaction_style="endpoint"),
            FastApiIntegration(transaction_style="endpoint"),
        ],
        traces_sample_rate=1.0,
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

if settings.APP_ENV == "production":
    app.add_middleware(ElasticIpLoggerMiddleware)
    # app.add_middleware(MetricsMiddleware)


@app.get("/ping")
async def pong(
    bg_tasks: BackgroundTasks,
):
    if get_now().hour == 0 and get_now().minute <= 1:
        bg_tasks.add_task(handle_stale_wallet_transactions)
    return {"ping": "pong!", "debug": settings.DEBUG}


Instrumentator().instrument(app).expose(app)


app.include_router(shared_router, dependencies=[Depends(api_key_header)])
app.include_router(account_router, dependencies=[Depends(api_key_header)])
app.include_router(contract_router, dependencies=[Depends(api_key_header)])
app.include_router(financial_router, dependencies=[Depends(api_key_header)])
app.include_router(advertisement_router, dependencies=[Depends(api_key_header)])
app.include_router(kenar_divar_router, dependencies=[Depends(api_key_header)])
app.include_router(eitaa_router, dependencies=[Depends(api_key_header)])
app.include_router(crm_router, dependencies=[Depends(api_key_header)])

app.add_exception_handler(exceptions.ServerException, exc_handlers.server_error_handler)  # type: ignore
app.add_exception_handler(exceptions.ConflictException, exc_handlers.conflict_error_handler)  # type: ignore
app.add_exception_handler(exceptions.NotFoundException, exc_handlers.not_found_error_handler)  # type: ignore
app.add_exception_handler(exceptions.PermissionException, exc_handlers.forbidden_error_handler)  # type: ignore
app.add_exception_handler(exceptions.ProcessingException, exc_handlers.processing_error_handler)  # type: ignore
app.add_exception_handler(exceptions.ValidationException, exc_handlers.bad_request_error_handler)  # type: ignore
app.add_exception_handler(RequestValidationError, exc_handlers.standard_validation_exception_handler)  # type: ignore
app.add_exception_handler(exceptions.AuthenticationException, exc_handlers.unauthenticated_error_handler)  # type: ignore # noqa
app.add_exception_handler(exceptions.ServiceUnavailableException, exc_handlers.service_unavailable_error_handler)  # type: ignore # noqa
