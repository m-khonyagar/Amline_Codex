from account.domain.entities.user import User
from contract.domain.enums import ContractStatus, PartyType
from contract.domain.prcontract.prcontract_service import PRContractService
from contract.domain.prcontract.steps_mapper import EDIT_REQUEST_STEP_MAPPER
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def prcontract_edit_request_handler(
    contract_id: int,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    sms_service: SMSService,
) -> None:
    with uow:
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        completed_steps = uow.contract_steps.get_contract_completed_steps(contract_id)

        prc_service.validate_party_has_permission_for_step(
            prc=prc, party=party, step=EDIT_REQUEST_STEP_MAPPER[party.party_type], completed_steps=completed_steps
        )

        if party.party_type == PartyType.TENANT:
            counter_party_type = PartyType.LANDLORD
        else:
            counter_party_type = PartyType.TENANT

        counter_party = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=counter_party_type)

        counter_party_user = uow.users.get_or_raise(id=counter_party.user_id)

        contract = uow.contracts.get_or_raise(id=contract_id)

        contract.update_status(ContractStatus.EDIT_REQUESTED)
        prc.update_contract(contract)
        uow.contract_steps.add_step(contract_id, EDIT_REQUEST_STEP_MAPPER[party.party_type])
        uow.commit()
        sms_service.send_contract_edit_requested(
            current_party_name=user.fullname,
            mobile=counter_party_user.mobile,
            contract_id=prc.id,
        )
