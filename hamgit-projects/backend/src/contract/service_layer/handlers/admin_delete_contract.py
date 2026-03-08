import datetime as dt

from contract.domain.enums import PRContractStep
from core.exceptions import ProcessingException
from core.translates import ProcessingExcTrans
from unit_of_work import UnitOfWork


def delete_contract_handler(
    contract_id: int,
    uow: UnitOfWork,
) -> bool:  # TODO add deleted_by

    entities_to_delete = []

    with uow:
        payments = uow.contract_payments.get_by_contract_id(contract_id)
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        not_allowed_steps = uow.contract_steps.get_by_contract_id_and_types(
            contract_id,
            [
                PRContractStep.TENANT_SIGNATURE,
                PRContractStep.LANDLORD_SIGNATURE,
                PRContractStep.TENANT_COMMISSION,
                PRContractStep.LANDLORD_COMMISSION,
            ],
        )

        if len(not_allowed_steps) > 0:
            raise ProcessingException(
                ProcessingExcTrans.pr_contract_cannot_be_deleted_after_some_steps,
                location=list({PRContractStep.resolve(step.type) for step in not_allowed_steps}),
            )

        entities_to_delete.append(prcontract)
        entities_to_delete.extend(payments or [])
        entities_to_delete.append(uow.contracts.get_or_raise(id=contract_id))
        entities_to_delete.extend(uow.contract_steps.get_by_contract_id(contract_id) or [])
        entities_to_delete.extend(uow.contract_parties.get_by_contract_id(contract_id) or [])
        entities_to_delete.extend(uow.contract_clauses.get_by_contract_id(contract_id) or [])
        entities_to_delete.append(uow.properties.get_by_id(prcontract.property_id or 99999))
        entities_to_delete.extend(uow.invoices.get_by_ids([p.invoice_id for p in payments if p.invoice_id]) or [])

        for entity in entities_to_delete:
            if entity:
                entity.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

        uow.commit()

    return True
