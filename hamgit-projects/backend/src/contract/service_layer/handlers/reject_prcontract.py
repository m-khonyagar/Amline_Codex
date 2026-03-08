from account.domain.entities.user import User
from contract.domain.entities.contract import Contract
from contract.domain.enums import ContractStatus
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import REJECT_STEP_MAPPER
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def reject_prcontract_handler(
    contract_id: int, user: User, uow: UnitOfWork, prc_service: PRContractService, sms_service: SMSService
) -> Contract:
    with uow:
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)

        step = REJECT_STEP_MAPPER[party.party_type]

        prc_service.validate_party_has_permission_for_step(prc, party, step)

        contract = uow.contracts.get_or_raise(id=contract_id)

        contract.update_status(ContractStatus.PARTY_REJECTED)

        prc.update_contract(contract)

        uow.contract_steps.add_step(contract_id=contract_id, type=step)

        counter_party = uow.contract_parties.get_counter_party(contract_id, party.id)
        if not counter_party:
            raise
        counter_party_user = uow.users.get_or_raise(id=counter_party.user_id)

        sms_service.send_counter_party_rejected(
            counter_party_name=counter_party_user.fullname,
            mobile=user.mobile,
            contract_id=contract_id,
        )

        uow.commit()

        uow.contracts.refresh(contract)

        return contract
