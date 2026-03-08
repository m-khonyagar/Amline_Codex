from typing import Generator

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from account.domain.entities.user import User
from account.domain.enums import UserRole
from account.service_layer.services.token_service import JwtTokenService, TokenService
from contract.domain.prcontract import (
    MonthlyRentService,
    PRContractCommissionService,
    PRContractService,
)
from contract.domain.prcontract.prcontract_pdf_generator_service import (
    PRContractPDFGeneratorService,
    PRContractPDFGeneratorServiceImpl,
)
from core import exceptions, settings
from core.abstracts.invoice_service import AbstractInvoiceService
from core.database import SESSION_FACTORY, VOIP_SESSION_FACTORY
from core.translates import auth_trans
from core.types import CurrentUser
from financial.service_layer.services.invoice_service import InvoiceService
from shared.service_layer.services.async_sms_service import (
    AsyncKavenegarSMSProvider,
    AsyncSMSService,
)
from shared.service_layer.services.broker_service import BrokerService, RedisBroker
from shared.service_layer.services.cache_service import RedisCacheService
from shared.service_layer.services.kavenegar_provider import KavenegarSMSProvider
from shared.service_layer.services.multi_provider_sms_service import (
    MultiProviderSMSService,
)
from shared.service_layer.services.s3_service import MinioS3Service, S3Service
from shared.service_layer.services.sms_service import SMSService
from shared.service_layer.services.storage_service import MinioStorage, StorageService
from shared.service_layer.services.tsms_provider import TSMSProvider
from shared.service_layer.services.user_verifier_service import (
    ZohalVerifier,
    UserVerifierService,
)
from shared.service_layer.services.voip_otp_service import VoipOtpService
from unit_of_work import SQLAlchemyUnitOfWork, UnitOfWork


def get_sqlalchemy_session() -> Generator[Session, None, None]:
    session = SESSION_FACTORY()
    try:
        yield session
    finally:
        session.close()


def get_voip_session() -> Generator[Session, None, None]:
    session = VOIP_SESSION_FACTORY()
    try:
        yield session
    finally:
        session.close()


def get_cache_service():
    return RedisCacheService(config=settings.redis_config)


def get_storage_service() -> StorageService:
    return MinioStorage(config=settings.minio_config)


def get_uow(session: Session = Depends(get_sqlalchemy_session), storage=Depends(get_storage_service)) -> UnitOfWork:
    return SQLAlchemyUnitOfWork(session, storage=storage)


def get_voip_uow(session: Session = Depends(get_voip_session), storage=Depends(get_storage_service)) -> UnitOfWork:
    return SQLAlchemyUnitOfWork(session, storage=storage)


def get_token_service(request: Request, cache=Depends(get_cache_service), uow=Depends(get_uow)) -> TokenService:
    client: tuple[str, int] | None = request.client  # client is a tuple of (ip, port)
    if not client:
        raise exceptions.ServerException(detail="client_ip_not_found")
    return JwtTokenService(cache=cache, uow=uow, config=settings.jwt_config, client_ip=client[0])


def get_current_user(request: Request, token_service: TokenService = Depends(get_token_service)) -> User:
    token = token_service.extract_token_from_authorization_header(request.headers.get("Authorization"))
    if not token_service.validate_access_token(token):
        raise exceptions.AuthenticationException(auth_trans.invalid_token)
    return token_service.get_user_from_token(token)


# def get_current_user(uow=Depends(get_uow)) -> User:
#     with uow:
#         return uow.users.get_or_raise(mobile="09355502015")


def get_conditional_current_user(
    request: Request, token_service: TokenService = Depends(get_token_service)
) -> User | None:
    try:
        token = token_service.extract_token_from_authorization_header(request.headers.get("Authorization"))
        if token_service.validate_access_token(token):
            return token_service.get_user_from_token(token)
    except Exception:
        return None

    return None


def get_admin(user: User = Depends(get_current_user)) -> CurrentUser:
    if not user.is_admin:
        raise exceptions.PermissionException
    return user


def get_contract_admin(user: User = Depends(get_current_user)) -> CurrentUser:
    if not any(
        [
            UserRole.SUPERUSER in user.roles,
            UserRole.STAFF in user.roles,
            UserRole.CONTRACT_ADMIN in user.roles,
        ]
    ):
        raise exceptions.PermissionException
    return user


def get_admin_panel_user(user: User = Depends(get_current_user)) -> CurrentUser:
    if not any(
        [
            UserRole.SUPERUSER in user.roles,
            UserRole.STAFF in user.roles,
            UserRole.CONTRACT_ADMIN in user.roles,
            UserRole.AUDITOR in user.roles,
            UserRole.EMPTY_CONTRACT_CREATOR in user.roles,
        ]
    ):
        raise exceptions.PermissionException
    return user


def get_sms_service() -> SMSService:
    return MultiProviderSMSService(sms_services=[TSMSProvider(), KavenegarSMSProvider()])


def get_voip_service() -> VoipOtpService:
    return VoipOtpService()


def get_async_sms_service() -> AsyncSMSService:
    return AsyncKavenegarSMSProvider(config=settings.kavenegar_config)


def get_broker_service() -> Generator[BrokerService, None, None]:
    broker = RedisBroker(config=settings.redis_config)
    try:
        yield broker
    finally:
        broker.close()


def get_invoice_service(uow=Depends(get_uow)) -> AbstractInvoiceService:
    return InvoiceService(uow=uow)


def get_prcontract_service() -> PRContractService:
    return PRContractService()


def get_prcontract_commission_service() -> PRContractCommissionService:
    return PRContractCommissionService(amline_user_id=int(settings.AMLINE_UID))


def get_monthly_rent_service() -> MonthlyRentService:
    return MonthlyRentService()


def get_prc_pdf_generator_service(uow=Depends(get_uow)) -> PRContractPDFGeneratorService:
    return PRContractPDFGeneratorServiceImpl(service_url=settings.PDF_GENERATOR_SERVICE_URL, uow=uow)


def get_user_verifier_service() -> UserVerifierService:
    return ZohalVerifier(configs=settings.zohal_config)


def get_s3_service() -> S3Service:
    return MinioS3Service(config=settings.minio_config)
