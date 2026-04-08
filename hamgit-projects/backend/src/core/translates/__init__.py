from core.translates.auth_exc import AuthExcTrans

from .conflict_exception import ConflictExcTrans
from .expressions import ExpressionsTranslation
from .not_found_exception import NotFoundExcTrans
from .permission_exception import PermExcTrans
from .processing_exception import ProcessingExcTrans
from .server_exceptions_translations import ServerExcTrans
from .validation_exception import ValidationExcTrans

processing_trans = ProcessingExcTrans()
not_found_trans = NotFoundExcTrans()
validation_trans = ValidationExcTrans()
perm_trans = PermExcTrans()
auth_trans = AuthExcTrans()

expressions_trans = ExpressionsTranslation()

__all__ = [
    "ConflictExcTrans",
    "ProcessingExcTrans",
    "ValidationExcTrans",
    "ServerExcTrans",
    "NotFoundExcTrans",
    "PermExcTrans",
    "processing_trans",
    "not_found_trans",
    "validation_trans",
    "perm_trans",
    "expressions_trans",
    "auth_trans",
]
