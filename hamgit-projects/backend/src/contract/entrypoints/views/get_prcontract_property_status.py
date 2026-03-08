from contract.service_layer.exceptions import UserIsNotContractPartyException
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_prcontract_property_status_view(contract_id: int, current_user: CurrentUser, uow: UnitOfWork) -> dict:

    with uow:
        prc = uow.prcontracts.get_by_contract_id_or_raise(contract_id)

        if prc.owner_user_id != current_user.id:
            raise UserIsNotContractPartyException

        if prc.property_id is None:
            return dict(specifications=False, facilities=False, details=False)

        property = uow.properties.get_or_raise(id=prc.property_id)

        return dict(
            specifications=property.specifications_completed,
            facilities=property.facilities_completed,
            details=property.details_completed,
        )
