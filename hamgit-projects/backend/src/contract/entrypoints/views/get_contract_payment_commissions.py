from contract.domain.enums import PartyType
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import UnitOfWork


def get_contract_payment_commissions_view(contract_id: int, uow: UnitOfWork, invoice_service: InvoiceService) -> list:
    with uow:
        tenant = uow.contract_parties.get_by_contract_id_and_party_type(contract_id, PartyType.TENANT)
        landlord = uow.contract_parties.get_by_contract_id_and_party_type(contract_id, PartyType.LANDLORD)

        if not landlord or not tenant:
            return []

        commissions = uow.contract_payments.get_contract_commissions(contract_id)
        result: list[dict] = []

        for commission in commissions:
            if commission.invoice_id:
                invoice = invoice_service.get_invoice_by_id(commission.invoice_id)
                commission.invoice = invoice
                if commission.payer_id == tenant.user_id:
                    payer = PartyType.TENANT
                elif commission.payer_id == landlord.user_id:
                    payer = PartyType.LANDLORD
                else:
                    payer = None
                result.append(commission.dumps(payer_party_type=payer))

        return result
