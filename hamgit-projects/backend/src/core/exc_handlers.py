from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from core import exceptions as core_exc
from core.translates import expressions_trans


async def standard_validation_exception_handler(_: Request, exc: RequestValidationError):
    errors = exc.errors()
    fields: list[str] = [error["loc"][-1] for error in errors]  # Extract the field names
    fields_str = " | ".join(map(str, fields))  # Join field names with a separator
    message = f"{expressions_trans.ERROR_IN_SUBMITTING_DATA} : {fields_str}"
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={"detail": message, "extra": errors})


async def not_found_error_handler(_: Request, exc: core_exc.NotFoundException):
    return JSONResponse(status_code=404, content={"detail": exc.detail, "extra": exc.context})


async def unauthenticated_error_handler(_: Request, exc: core_exc.AuthenticationException):
    return JSONResponse(status_code=401, content={"detail": exc.detail, "extra": exc.context})


async def conflict_error_handler(_: Request, exc: core_exc.ConflictException):
    return JSONResponse(status_code=409, content={"detail": exc.detail, "extra": exc.context})


async def bad_request_error_handler(_: Request, exc: core_exc.BadRequestException):
    return JSONResponse(status_code=400, content={"detail": exc.detail, "extra": exc.context, "location": exc.location})


async def forbidden_error_handler(_: Request, exc: core_exc.PermissionException):
    return JSONResponse(status_code=403, content={"detail": exc.detail, "extra": exc.context})


async def server_error_handler(_: Request, exc: core_exc.ServerException):
    return JSONResponse(status_code=500, content={"detail": exc.detail, "extra": exc.context})


async def processing_error_handler(_: Request, exc: core_exc.ProcessingException):
    return JSONResponse(status_code=422, content={"detail": exc.detail, "extra": exc.context, "location": exc.location})


async def service_unavailable_error_handler(_: Request, exc: core_exc.ServiceUnavailableException):
    return JSONResponse(status_code=503, content={"detail": exc.detail, "extra": exc.context})
