from collections import defaultdict
from datetime import datetime

from account.domain.entities.user import User
from contract.domain.enums import ContractStatus, PartyType, PRContractStep
from contract.domain.prcontract.prcontract_service import PRContractService
from unit_of_work import UnitOfWork


def get_user_contracts_list_view(user: User, uow: UnitOfWork, prc_service: PRContractService) -> list[dict]:
    with uow:
        contracts = uow.contracts.get_by_user_id(user.id)
        ids = [contract.id for contract in contracts]
        contract_parties = resolve_contracts_parties(uow, ids)
        contract_steps = resolve_contracts_steps(uow, ids)

        result = list()

        for contract in contracts:
            if contract.status == ContractStatus.DRAFT and not contract.owner_user_id == user.id:
                continue

            steps = contract_steps[contract.id]
            completed_steps: list[PRContractStep] = [
                step for step, completed_at in steps.items() if completed_at is not None
            ]

            parties = contract_parties[contract.id]
            user_party = {party["user_id"]: party["party_type"] for party in parties}

            result.append(
                contract.dumps(
                    parties=parties,
                    steps=steps,
                    current_user_party_type=user_party[str(user.id)],
                    current_user_is_owner=contract.owner_user_id == user.id,
                    state=prc_service.get_contract_state(
                        completed_steps=completed_steps,
                        contract_status=contract.status,
                        owner_party_type=user_party[str(contract.owner_user_id)],
                    ),
                    owner_party_type=user_party[str(contract.owner_user_id)],
                    created_at=contract.created_at,
                )
            )
        result = sorted(result, key=lambda x: x["created_at"], reverse=True)

        return result


def resolve_contracts_parties(uow: UnitOfWork, contract_ids: list[int]) -> dict[int, list[dict]]:
    parties = uow.fetchall(
        """
        SELECT contract_id, user_id, party_type, first_name, last_name
        FROM contract.contract_parties LEFT JOIN account.users ON contract_parties.user_id = users.id
        WHERE contract_id = ANY(:contract_ids) AND contract_parties.deleted_at IS NULL AND users.deleted_at IS NULL;
        """,
        contract_ids=contract_ids,
    )

    result = defaultdict(list)
    for party in parties:
        contract_id = party["contract_id"]
        result[contract_id].append(
            {
                "user_id": str(party["user_id"]),
                "party_type": PartyType.resolve(party["party_type"]),
                "first_name": party["first_name"],
                "last_name": party["last_name"],
            }
        )
    return result


def resolve_contracts_steps(
    uow: UnitOfWork, contract_ids: list[int]
) -> dict[int, dict[PRContractStep, datetime | None]]:
    steps = uow.fetchall(
        """
        SELECT contract_id, type, completed_at FROM contract.contract_steps
        WHERE contract_id = ANY(:contract_ids) AND contract_steps.deleted_at IS NULL;
        """,
        contract_ids=contract_ids,
    )

    result: dict[int, dict[PRContractStep, datetime | None]] = defaultdict(dict)
    for step in steps:
        contract_id = step["contract_id"]
        prc_step = PRContractStep.resolve(step["type"])
        if contract_id not in result:
            result[contract_id] = {}
        result[contract_id][prc_step] = step["completed_at"]

    for contract_id in result:
        for prc_step in PRContractStep:
            if prc_step not in result[contract_id]:
                result[contract_id][prc_step] = None

    return result
