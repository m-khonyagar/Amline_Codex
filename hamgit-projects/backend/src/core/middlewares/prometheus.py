from fastapi import Request
from prometheus_client import Counter, Histogram
from starlette.middleware.base import BaseHTTPMiddleware

REQUEST_COUNT = Counter("request_count", "App Request Count", ["method", "endpoint"])
REQUEST_LATENCY = Histogram("request_latency_seconds", "Request latency", ["method", "endpoint"])


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        method = request.method
        endpoint = request.url.path

        REQUEST_COUNT.labels(method, endpoint).inc()

        with REQUEST_LATENCY.labels(method, endpoint).time():
            response = await call_next(request)

        return response
