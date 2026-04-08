from contract.domain.enums import (
    ContractStatus,
    PartyType,
    PRContractState,
    PRContractStep,
)


class PRContractStepManager:

    def get_contract_state(
        self, completed_steps: list | set, status: ContractStatus, owner_party_type: PartyType
    ) -> PRContractState:
        if status == ContractStatus.ADMIN_REJECTED:
            return PRContractState.ADMIN_REJECTED

        if status == ContractStatus.PARTY_REJECTED and owner_party_type == PartyType.TENANT:
            return PRContractState.LANDLORD_REJECTED

        if status == ContractStatus.PARTY_REJECTED and owner_party_type == PartyType.LANDLORD:
            return PRContractState.LANDLORD_REJECTED

        if status == ContractStatus.EDIT_REQUESTED and owner_party_type == PartyType.TENANT:
            return PRContractState.LANDLORD_EDIT_REQUEST

        if status == ContractStatus.EDIT_REQUESTED and owner_party_type == PartyType.LANDLORD:
            return PRContractState.TENANT_EDIT_REQUEST

        steps_types = {PRContractStep.resolve(step) for step in completed_steps}

        if self.tracking_code_delivered_steps.issubset(steps_types):
            return PRContractState.TRACKING_CODE_DELIVERED
        if self.tracking_code_requested_steps.issubset(steps_types):
            return PRContractState.PENDING_TRACKING_CODE_DELIVERY
        if self.admin_approved_steps.issubset(steps_types):
            return PRContractState.PENDING_TRACKING_CODE_REQUEST
        if self.required_steps_for_admin_approve.issubset(steps_types):
            return PRContractState.PENDING_ADMIN_APPROVAL
        if self.tenant_payed_commission_steps.issubset(steps_types):
            return PRContractState.PENDING_LANDLORD_COMMISSION
        if self.landlord_payed_commission_steps.issubset(steps_types):
            return PRContractState.PENDING_TENANT_COMMISSION
        if self.tenant_signed_steps__tenant_owner.issubset(steps_types):
            return PRContractState.PENDING_PAYING_COMMISSION
        if self.tenant_signed_steps__landlord_owner.issubset(steps_types):
            return PRContractState.PENDING_PAYING_COMMISSION

        if owner_party_type == PartyType.TENANT:
            if self.required_steps_for_tenant_signature__tenant_owner.issubset(steps_types):
                return PRContractState.PENDING_TENANT_SIGNATURE
            if self.required_steps_for_landlord_signature__tenant_owner.issubset(steps_types):
                return PRContractState.PENDING_LANDLORD_SIGNATURE
            if self.tenant_approved_steps.issubset(steps_types):
                return PRContractState.PENDING_LANDLORD_INFORMATION
            if self.required_steps_for_tenant_approve.issubset(steps_types):
                return PRContractState.PENDING_TENANT_APPROVAL
        elif owner_party_type == PartyType.LANDLORD:
            if self.required_steps_for_tenant_signature__landlord_owner.issubset(steps_types):
                return PRContractState.PENDING_TENANT_SIGNATURE
            if self.landlord_signed_steps__landlord_owner.issubset(steps_types):
                return PRContractState.PENDING_TENANT_INFORMATION
            if self.required_steps_for_landlord_signature__landlord_owner.issubset(steps_types):
                return PRContractState.PENDING_LANDLORD_SIGNATURE

        return PRContractState.DRAFT

    @property
    def start_steps(self) -> set[PRContractStep]:
        return {
            PRContractStep.DEPOSIT,
            PRContractStep.MONTHLY_RENT,
            PRContractStep.DATES_AND_PENALTIES,
            PRContractStep.ADD_COUNTER_PARTY,
            PRContractStep.RENT_PAYMENT,
            PRContractStep.DEPOSIT_PAYMENT,
        }

    @property
    def property_steps(self) -> set[PRContractStep]:
        return {
            PRContractStep.PROPERTY_SPECIFICATIONS,
            PRContractStep.PROPERTY_DETAILS,
            PRContractStep.PROPERTY_FACILITIES,
        }

    # When Owner is Tenant

    @property
    def required_steps_for_tenant_approve(self) -> set[PRContractStep]:
        return self.start_steps | {PRContractStep.TENANT_INFORMATION}

    @property
    def tenant_approved_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_tenant_approve | {PRContractStep.TENANT_APPROVE}

    @property
    def required_steps_for_landlord_signature__tenant_owner(self) -> set[PRContractStep]:
        return self.tenant_approved_steps | self.property_steps | {PRContractStep.LANDLORD_INFORMATION}

    @property
    def landlord_signed_steps__tenant_owner(self) -> set[PRContractStep]:
        return self.required_steps_for_landlord_signature__tenant_owner | {PRContractStep.LANDLORD_SIGNATURE}

    @property
    def required_steps_for_tenant_signature__tenant_owner(self) -> set[PRContractStep]:
        return self.landlord_signed_steps__tenant_owner

    @property
    def tenant_signed_steps__tenant_owner(self) -> set[PRContractStep]:
        return self.landlord_signed_steps__tenant_owner | {PRContractStep.TENANT_SIGNATURE}

    # When Owner is Landlord

    @property
    def required_steps_for_landlord_signature__landlord_owner(self) -> set[PRContractStep]:
        return self.start_steps | self.property_steps | {PRContractStep.LANDLORD_INFORMATION}

    @property
    def landlord_signed_steps__landlord_owner(self) -> set[PRContractStep]:
        return self.required_steps_for_landlord_signature__landlord_owner | {PRContractStep.LANDLORD_SIGNATURE}

    @property
    def required_steps_for_tenant_signature__landlord_owner(self) -> set[PRContractStep]:
        return self.landlord_signed_steps__landlord_owner | {PRContractStep.TENANT_INFORMATION}

    @property
    def tenant_signed_steps__landlord_owner(self) -> set[PRContractStep]:
        return self.required_steps_for_tenant_signature__landlord_owner | {PRContractStep.TENANT_SIGNATURE}

    # Owner is not important

    @property
    def required_steps_for_paying_commission(self) -> set[PRContractStep]:
        return self.tenant_signed_steps__landlord_owner

    @property
    def landlord_payed_commission_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_paying_commission | {PRContractStep.LANDLORD_COMMISSION}

    @property
    def tenant_payed_commission_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_paying_commission | {PRContractStep.TENANT_COMMISSION}

    @property
    def required_steps_for_admin_approve(self) -> set[PRContractStep]:
        return self.required_steps_for_paying_commission | {
            PRContractStep.LANDLORD_COMMISSION,
            PRContractStep.TENANT_COMMISSION,
        }

    @property
    def admin_approved_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_admin_approve | {PRContractStep.ADMIN_APPROVE}

    @property
    def required_steps_for_requesting_tracking_code(self) -> set[PRContractStep]:
        return self.admin_approved_steps

    @property
    def tracking_code_requested_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_requesting_tracking_code | {PRContractStep.TRACKING_CODE_REQUESTED}

    @property
    def required_steps_for_delivering_tracking_code(self) -> set[PRContractStep]:
        return self.tracking_code_requested_steps

    @property
    def tracking_code_delivered_steps(self) -> set[PRContractStep]:
        return self.required_steps_for_delivering_tracking_code | {PRContractStep.TRACKING_CODE_DELIVERED}
