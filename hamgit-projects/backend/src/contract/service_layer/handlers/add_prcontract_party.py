"""ADMIN ROUTE HANDLER"""

from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PRContractStep
from contract.service_layer.dtos import ContractPartyDto
from core.exceptions import ValidationException
from core.translates.validation_exception import ValidationExcTrans
from unit_of_work import UnitOfWork


# Admin add prcontract party
def add_prcontract_party_handler(
    contract_id: int,
    data: ContractPartyDto,
    uow: UnitOfWork,
) -> ContractParty:
    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        user = uow.users.get_or_raise(id=data.user_id)

        parties = uow.contract_parties.get_by_contract_id(contract_id=prcontract.contract_id)

        # Check party exist
        if user.id in [p.user_id for p in parties]:
            raise ValidationException(ValidationExcTrans.exist_contract_party_type)

        # Check party type exist
        exist_party = next((p for p in parties if p.party_type == data.party_type), None)

        if exist_party:
            exist_party.delete()

        # if data.party_type in [p.party_type for p in parties]:
        #     raise ValidationException(ValidationExcTrans.exist_contract_party_type)

        party = ContractParty(user_id=user.id, contract_id=contract_id, party_type=data.party_type)

        uow.contract_parties.add(party)

        # Change payments
        if exist_party:
            payments = uow.contract_payments.get_by_contract_id(contract_id=contract_id)
            for p in payments:
                if p.paid_at is None:
                    if p.payer_id == exist_party.user_id:
                        p.payer_id = party.user_id
                    if p.payee_id == exist_party.user_id:
                        p.payee_id = party.user_id

                    if p.invoice_id:
                        invoice = uow.invoices.get_by_id(p.invoice_id)
                        invoice.payer_user_id = p.payer_id
                        invoice.payee_user_id = p.payee_id

                        uow.invoices.add(invoice)

                    uow.contract_payments.add(p)

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.ADD_COUNTER_PARTY)

        uow.commit()
        uow.contract_parties.refresh(party)
        return party
