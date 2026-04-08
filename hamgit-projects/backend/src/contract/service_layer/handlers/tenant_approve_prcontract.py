from account.domain.entities.user import User
from contract.domain.enums import ContractStatus, PartyType, PRContractStep
from contract.domain.prcontract import PRContractService
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def tenant_approve_prcontract_handler(
    contract_id: int,
    uow: UnitOfWork,
    user: User,
    sms_service: SMSService,
    prc_service: PRContractService,
) -> None:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.TENANT_APPROVE, completed_steps=contract_steps
        )

        landlord = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=PartyType.LANDLORD)
        landlord_user = uow.users.get_or_raise(id=landlord.user_id)
        sms_service.send_invitation_to_landlord(
            tenant_fullname=user.fullname, mobile=landlord_user.mobile, contract_id=contract_id
        )

        contract = uow.contracts.get_or_raise(id=contract_id)
        contract.update_status(ContractStatus.ACTIVE)
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        prcontract.update_contract(contract)

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.TENANT_APPROVE)

        uow.commit()
