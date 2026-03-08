from core import exceptions as exc
from core.translates import AuthExcTrans, ConflictExcTrans, ProcessingExcTrans
from core.translates.server_exceptions_translations import ServerExcTrans


class S3FileUploadException(exc.ServerException): ...


class S3FileDownloadException(exc.ServerException): ...


class S3ConnectionError(exc.ServerException): ...


class InvalidBucketNameException(exc.ValidationException): ...


class FileIsNotPublicException(exc.ProcessingException):
    def __init__(self) -> None:
        super().__init__(detail=ProcessingExcTrans.file_is_not_public)


class StorageServiceConnectionException(exc.ServerException):
    def __init__(self) -> None:
        super().__init__(detail=ServerExcTrans.storage_service_connection_error)


class MinioServerIsDownException(exc.ServerException): ...


class OtpRateLimitExceededException(exc.ConflictException):
    def __init__(self) -> None:
        super().__init__(ConflictExcTrans.otp_rate_limit_exceeded)


class InvalidOtpCodeException(exc.ValidationException):
    def __init__(self) -> None:
        super().__init__(AuthExcTrans.invalid_otp_code)


class OtpExpiredException(exc.ValidationException):
    def __init__(self) -> None:
        super().__init__(AuthExcTrans.otp_expired)


class TokenRevokedException(exc.AuthenticationException):
    def __init__(self) -> None:
        super().__init__(AuthExcTrans.token_revoked)


class InvalidTokenException(exc.AuthenticationException):
    def __init__(self) -> None:
        super().__init__(AuthExcTrans.invalid_token)


class ZohalUnknownResponseException(exc.ServerException):
    def __init__(self, response: dict) -> None:
        super().__init__(detail="zohal unknown error", context=response)


class ZohalServiceUnavailableException(exc.ServerException):
    def __init__(self) -> None:
        super().__init__(detail="zohal service unavailable")
