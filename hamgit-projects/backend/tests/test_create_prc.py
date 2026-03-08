import pytest

from contract.domain.entities.contract import Contract
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import ContractType, PartyType
from unit_of_work import UnitOfWork


@pytest.fixture
def prc(uow: UnitOfWork) -> PropertyRentContract:
    with uow:
        user = uow.users.get_or_raise(mobile="09355502015")
        contract = Contract(owner_user_id=user.id, type=ContractType.PROPERTY_RENT)
        prc = PropertyRentContract(
            contract_id=contract.id,
            owner_user_id=contract.owner_user_id,
            owner_party_type=PartyType.LANDLORD,
            status=contract.status,
            is_guaranteed=True,
            deposit_amount=1,
        )
        uow.contracts.add(contract)
        uow.prcontracts.add(prc)

        uow.commit()

        uow.prcontracts.refresh(prc)

        return prc


def test_prc_create(uow: UnitOfWork, prc: PropertyRentContract) -> None:
    with uow:
        db_prc = uow.prcontracts.get_or_raise(id=prc.id)

        assert db_prc.is_guaranteed is True
