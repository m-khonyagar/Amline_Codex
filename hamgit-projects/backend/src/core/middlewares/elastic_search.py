from datetime import datetime
from logging import Logger

import pytz
from elasticsearch import AsyncElasticsearch
from fastapi import BackgroundTasks, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from core.settings import elastic_config as ec


class ElasticIpLoggerMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.elastic_ip_logger = ElasticIpLogger()

    async def dispatch(self, request: Request, call_next) -> Response:
        request_body = await request.body()
        request.state.body = request_body

        response = await call_next(request)

        if request.method not in {"OPTIONS", "GET"}:
            background_tasks = BackgroundTasks()
            background_tasks.add_task(self.elastic_ip_logger.send_logs_to_elastic, request)
            response.background = background_tasks

        return response


class ElasticIpLogger:
    def __init__(self):
        es_uri = f"http://elastic:{ec.password}@{ec.host}:{ec.port}/"
        self.es = AsyncElasticsearch(es_uri)
        self.logger = Logger("ElasticIpLogger")
        self.tehran_tz = pytz.timezone("Asia/Tehran")

        self.RELEVANT_HEADERS = [
            "host",
            "origin",
            "referer",
            "x-real-ip",
            "user-agent",
            "authorization",
            "x-forwarded-for",
            "x-frame-options",
            "x-content-type-options",
            "content-security-policy",
            "strict-transport-security",
        ]

    async def send_logs_to_elastic(self, request: Request):
        try:
            path = request.url.path
            headers = request.headers
            body = request.state.body
            request_body = body.decode("utf-8") if (body and "files" not in path) else None

            data = {
                "path": path,
                "method": request.method,
                "request_body": request_body,
                "timestamp": datetime.now(self.tehran_tz).isoformat(),
                "ip_address": headers.get("X-Forwarded-For", request.client.host) if request.client else "NoIp",
                "headers": {key: value for key, value in headers.items() if key.lower() in self.RELEVANT_HEADERS},
            }
            await self.es.index(index="request_logs", document=data)
        except Exception as e:
            self.logger.error(f"Error logging to Elasticsearch: {e}")
