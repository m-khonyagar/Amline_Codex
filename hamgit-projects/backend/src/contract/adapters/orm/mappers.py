from sqlalchemy.orm import relationship

from account.adapters.orm.read_only_models import BankAccountROM, UserROM
from contract.adapters.orm import data_models, read_only_models
from contract.domain import entities
from core.database import SQLALCHEMY_READONLY_REGISTRY, SQLALCHEMY_REGISTRY
from shared.adapters.orm.read_only_models import PropertyROM


def start_mappers():
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.Contract,
        data_models.contracts,
        properties={
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == Contract.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(entities.ContractStep, data_models.contract_steps)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.ContractParty, data_models.contract_parties)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.ContractClause, data_models.contract_clauses)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.BaseContractClauses, data_models.base_contract_clauses)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.PropertyRentContract, data_models.property_rent_contracts)
    SQLALCHEMY_REGISTRY.map_imperatively(entities.Cheque, data_models.cheques)
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.ContractDescription,
        data_models.contract_descriptions,
        properties={
            "created_by_user": relationship(
                "User",
                primaryjoin="User.id == ContractDescription.created_by",
                viewonly=True,
                uselist=False,
                lazy="joined",
            )
        },
    )
    SQLALCHEMY_REGISTRY.map_imperatively(
        entities.ContractPayment,
        data_models.contract_payments,
        properties={"cheque": relationship(entities.Cheque, lazy="joined", uselist=False)},
    )
    start_read_only_mappers()


def start_read_only_mappers():
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ChequeROM,
        read_only_models.cheques_rom,
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ContractPaymentROM,
        read_only_models.contract_payments_rom,
        properties={"cheque": relationship(read_only_models.ChequeROM, lazy="joined", uselist=False)},
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ContractStepROM,
        read_only_models.contract_steps_rom,
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ContractClauseROM,
        read_only_models.contract_clauses_rom,
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ContractPartyROM,
        read_only_models.contract_parties_rom,
        properties={"user": relationship(UserROM, lazy="joined")},
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.ContractROM,
        read_only_models.contracts_rom,
        properties={
            "parties": relationship(
                read_only_models.ContractPartyROM,
                primaryjoin="and_(ContractROM.id == ContractPartyROM.contract_id, \
                                ContractPartyROM.deleted_at.is_(None))",
                uselist=True,
                lazy="joined",
            ),
            "steps": relationship(
                read_only_models.ContractStepROM,
                primaryjoin="and_(ContractROM.id == ContractStepROM.contract_id, \
                                ContractStepROM.deleted_at.is_(None))",
                uselist=True,
                lazy="joined",
            ),
            "clauses": relationship(
                read_only_models.ContractClauseROM,
                primaryjoin="and_(ContractROM.id == ContractClauseROM.contract_id, \
                                ContractClauseROM.deleted_at.is_(None))",
                uselist=True,
                lazy="joined",
            ),
            "payments": relationship(
                read_only_models.ContractPaymentROM,
                primaryjoin="and_(ContractROM.id == ContractPaymentROM.contract_id, \
                                ContractPaymentROM.deleted_at.is_(None))",
                uselist=True,
                lazy="joined",
            ),
        },
    )
    SQLALCHEMY_READONLY_REGISTRY.map_imperatively(
        read_only_models.PRContractROM,
        read_only_models.prcontracts_rom,
        properties={
            "contract": relationship(read_only_models.ContractROM, lazy="joined"),
            "property": relationship(PropertyROM, lazy="joined"),
            "tenant_bank_account": relationship(
                BankAccountROM,
                primaryjoin="and_(PRContractROM.tenant_bank_account_id == BankAccountROM.id, \
                                BankAccountROM.deleted_at.is_(None))",
            ),
            "landlord_rent_bank_account": relationship(
                BankAccountROM,
                primaryjoin="and_(PRContractROM.landlord_rent_bank_account_id == BankAccountROM.id, \
                                BankAccountROM.deleted_at.is_(None))",
            ),
            "landlord_deposit_bank_account": relationship(
                BankAccountROM,
                primaryjoin="and_(PRContractROM.landlord_deposit_bank_account_id == BankAccountROM.id, \
                                BankAccountROM.deleted_at.is_(None))",
            ),
        },
    )
