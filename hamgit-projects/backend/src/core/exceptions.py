from core.base.abstract_exception import AbstractException
from core.translates import auth_trans, perm_trans


class BadRequestException(AbstractException):  # 400
    """Raised for a bad request that cannot be processed due to client error."""


class ValidationException(BadRequestException):
    """Raised when a provided value does not meet the expected criteria."""


class AuthenticationException(AbstractException):  # 401
    """Raised when authentication is required to access a resource."""

    def __init__(
        self,
        detail: str = auth_trans.unauthorized_access,
        location: list[str] = list(),
        context: dict = dict(),
    ) -> None:
        super().__init__(detail, location, context)


class PermissionException(AbstractException):  # 403
    def __init__(
        self,
        detail: str = perm_trans.user_does_not_have_enough_permission,
        location: list[str] = list(),
        context: dict = dict(),
    ) -> None:
        super().__init__(detail, location, context)

    """Raised when a user does not have permission to perform an action."""


class NotFoundException(AbstractException):  # 404
    """Raised when a requested resource is not found."""


class ConflictException(AbstractException):  # 409
    """Raised when a resource conflict occurs."""


class DataIntegrityException(ConflictException):
    """Raised when there is a data integrity issue."""


class ProcessingException(AbstractException):  # 422
    """Raised when an operation cannot be processed."""


class ServerException(AbstractException):  # 500
    """Raised when an internal server error occurs."""


class NotImplementedException(AbstractException):  # 501
    """Raised when a requested method or operation is not implemented."""


class ServiceUnavailableException(AbstractException):  # 503
    """Raised when the server is currently unable to handle the request."""
