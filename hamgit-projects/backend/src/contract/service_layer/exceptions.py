from core.exceptions import ConflictException, PermissionException, ProcessingException
from core.translates import PermExcTrans, ProcessingExcTrans
from core.translates.conflict_exception import ConflictExcTrans


class ContractIsNotEditRequestedException(PermissionException):
    def __init__(self):
        super().__init__(
            detail=PermExcTrans.contract_is_not_editable,
            context={"message": "If user is admin, contract status should be EDIT_REQUESTED"},
        )


class InvalidActionOrderException(ProcessingException):
    def __init__(self, detail: str = ProcessingExcTrans.action_order_incorrect, context={}):
        super().__init__(detail=detail, context=context)


class ContractIsRejectedException(ProcessingException):
    """Raised when a contract is rejected."""

    def __init__(self):
        super().__init__(ProcessingExcTrans.contract_is_rejected)


class UserIsNotContractPartyException(PermissionException):
    """Raised when a user is not a party to a contract."""

    def __init__(self):
        super().__init__(PermExcTrans.user_is_not_contract_party)


class PartyIsNotLandlordException(PermissionException):
    """Raised when a user is not a landlord."""

    def __init__(self):
        super().__init__(PermExcTrans.party_is_not_landlord)


class PartyIsNotTenantException(PermissionException):
    """Raised when a user is not a tenant."""

    def __init__(self):
        super().__init__(PermExcTrans.party_is_not_tenant)


class PartyIsNotContractOwnerException(PermissionException):
    """Raised when a user is not the owner of a contract."""

    def __init__(self):
        super().__init__(PermExcTrans.party_is_not_contract_owner)


class PartyTypeAlreadyExistsException(ConflictException):
    """Raised when a contract party type already exists for a contract."""

    def __init__(self):
        super().__init__(ConflictExcTrans.party_type_already_exists)


class ContractPartyAlreadySignedException(ConflictException):
    """Raised when a contract party has already signed a contract."""

    def __init__(self):
        super().__init__(ConflictExcTrans.contract_party_already_signed)


class ContractIsNotEditableException(ProcessingException):
    """Raised when a contract is not editable (not in draft status)."""

    def __init__(self):
        super().__init__(ProcessingExcTrans.contract_is_not_editable)


class MissingContractPartiesException(ProcessingException):
    """Raised when both parties do not exist for a property rent contract."""

    def __init__(self):
        super().__init__(ProcessingExcTrans.contract_parties_not_set)
