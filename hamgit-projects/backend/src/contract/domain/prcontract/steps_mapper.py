from contract.domain.enums import (
    PartyType,
    PaymentType,
    PRContractStep,
    TrackingCodeStatus,
)

PARTY_STEP_MAPPER = {
    PartyType.TENANT: PRContractStep.TENANT_INFORMATION,
    PartyType.LANDLORD: PRContractStep.LANDLORD_INFORMATION,
}

EDIT_REQUEST_STEP_MAPPER = {
    PartyType.TENANT: PRContractStep.TENANT_EDIT_REQUEST,
    PartyType.LANDLORD: PRContractStep.LANDLORD_EDIT_REQUEST,
}

REJECT_STEP_MAPPER = {
    PartyType.TENANT: PRContractStep.TENANT_REJECTED,
    PartyType.LANDLORD: PRContractStep.LANDLORD_REJECTED,
}

TRACKING_CODE_STEP_MAPPER = {
    TrackingCodeStatus.DELIVERED: PRContractStep.TRACKING_CODE_DELIVERED,
    TrackingCodeStatus.REQUESTED: PRContractStep.TRACKING_CODE_REQUESTED,
    TrackingCodeStatus.FAILED: PRContractStep.TRACKING_CODE_FAILED,
}

PAYMENT_STEP_MAPPER = {
    PaymentType.DEPOSIT: PRContractStep.DEPOSIT_PAYMENT,
    PaymentType.RENT: PRContractStep.RENT_PAYMENT,
    PaymentType.COMMISSION: [PRContractStep.TENANT_COMMISSION, PRContractStep.LANDLORD_COMMISSION],
}

PARTY_COMMISSION_STEP_MAPPER = {
    PartyType.TENANT: PRContractStep.TENANT_COMMISSION,
    PartyType.LANDLORD: PRContractStep.LANDLORD_COMMISSION,
}

SIGNATURE_STEP_MAPPER = {
    PartyType.TENANT: PRContractStep.TENANT_SIGNATURE,
    PartyType.LANDLORD: PRContractStep.LANDLORD_SIGNATURE,
}

COUNTER_PARTY_TYPE_MAPPER = {
    PartyType.TENANT: PartyType.LANDLORD,
    PartyType.LANDLORD: PartyType.TENANT,
}
