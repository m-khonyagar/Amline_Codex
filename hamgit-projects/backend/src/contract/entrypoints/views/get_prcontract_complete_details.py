from contract.domain.enums import PartyType
from unit_of_work import UnitOfWork


def get_prcontract_complete_details_view(contract_id: int, uow: UnitOfWork) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        contract_parties = uow.contract_parties.get_by_contract_id(contract_id)
        parties_types = {party.party_type: party for party in contract_parties}
        tenant = parties_types.get(PartyType.TENANT)
        landlord = parties_types.get(PartyType.LANDLORD)
        property = uow.properties.get_or_raise(id=prcontract.property_id) if prcontract.property_id else None

        return {
            "prcontract": prcontract.dumps(),
            "contract_parties": [party.dumps() for party in contract_parties],
            "tenant": tenant.dumps() if tenant else None,
            "landlord": landlord.dumps() if landlord else None,
            "property": property.dumps() if property else None,
        }
