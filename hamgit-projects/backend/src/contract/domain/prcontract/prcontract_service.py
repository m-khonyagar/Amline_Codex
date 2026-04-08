from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.entities.contract_step import ContractStep
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import (
    ContractStatus,
    PartyType,
    PRContractState,
    PRContractStep,
)
from contract.domain.prcontract.prcontract_step_manager import PRContractStepManager
from contract.domain.types import ContractOwner
from contract.service_layer.exceptions import UserIsNotContractPartyException
from core.exceptions import ConflictException, PermissionException
from core.translates import perm_trans
from core.translates.conflict_exception import ConflictExcTrans


class PRContractService:

    def __init__(self, step_manager: PRContractStepManager = PRContractStepManager()):
        self.step_manager = step_manager

    def get_contract_state(
        self, completed_steps: list | set, contract_status: ContractStatus, owner_party_type: PartyType
    ) -> PRContractState:
        return self.step_manager.get_contract_state(completed_steps, contract_status, owner_party_type)

    def validate_party_has_permission_for_step(
        self,
        prc: PropertyRentContract,
        party: ContractParty,
        step: PRContractStep,
        completed_steps: list[ContractStep] = list(),
    ) -> None:

        if prc.status in [ContractStatus.ADMIN_REJECTED, ContractStatus.PARTY_REJECTED, ContractStatus.EDIT_REQUESTED]:
            raise PermissionException(
                perm_trans.contract_is_not_editable,
                context={"message": f"Contract is in {prc.status} state"},
            )

        if prc.status == ContractStatus.DRAFT and prc.owner.user_id != party.user_id:
            raise PermissionException(perm_trans.party_is_not_contract_owner)

        steps_types = {PRContractStep.resolve(step.type) for step in completed_steps}

        if step in [PRContractStep.LANDLORD_REJECTED, PRContractStep.TENANT_REJECTED]:
            if prc.owner.user_id == party.user_id:
                raise PermissionException(perm_trans.contract_owner_cannot_reject_contract)

        state = self.get_contract_state(steps_types, prc.status, prc.owner.party_type)

        if step in [PRContractStep.LANDLORD_EDIT_REQUEST, PRContractStep.TENANT_EDIT_REQUEST]:
            self.validate_party_has_perm_for_edit_request(prc, party, state)

        if step in self.step_manager.start_steps and prc.status != PRContractState.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)

        if step in self.step_manager.start_steps and not self.party_is_owner(party, prc.owner):
            raise PermissionException(perm_trans.party_is_not_contract_owner)

        if step is PRContractStep.TENANT_INFORMATION:
            self.party_has_perm_to_update_tenant_information(prc, party, state)

        if step is PRContractStep.TENANT_APPROVE:
            self.party_has_perm_to_approve(party, state, steps_types)

        if step is PRContractStep.LANDLORD_INFORMATION:
            self.party_has_perm_to_update_landlord_information(prc, party, state)

        if step is PRContractStep.LANDLORD_SIGNATURE:
            self.landlord_has_perm_to_sign(prc, party, steps_types)

        if step is PRContractStep.TENANT_SIGNATURE:
            self.tenant_has_perm_to_sign(prc, party, steps_types)

        if step in self.step_manager.property_steps:
            self.party_has_perm_to_update_property_information(prc, party, state)

        if step in [PRContractStep.LANDLORD_REJECTED, PRContractStep.TENANT_REJECTED]:
            self.party_has_perm_to_reject(prc, party)

        if step is PRContractStep.TENANT_COMMISSION:
            self.party_has_perm_to_pay_tenant_commission(prc, party, steps_types)

        if step is PRContractStep.LANDLORD_COMMISSION:
            self.party_has_perm_to_pay_landlord_commission(prc, party, steps_types)

        if step is PRContractStep.RENT_PAYMENT:
            self.party_has_perm_to_add_rent_payment(prc, party, steps_types)

        if step is PRContractStep.DEPOSIT_PAYMENT:
            self.party_has_perm_to_add_deposit_payment(prc, party, steps_types)

    def party_has_perm_to_add_deposit_payment(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if prc.status != ContractStatus.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)

        if PRContractStep.DEPOSIT_PAYMENT in steps:
            raise PermissionException(perm_trans.deposit_payment_already_finalized)

        if prc.owner_user_id != party.user_id:
            raise PermissionException(perm_trans.party_is_not_contract_owner)

    def party_has_perm_to_add_rent_payment(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if prc.status != ContractStatus.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)

        if PRContractStep.RENT_PAYMENT in steps:
            raise PermissionException(perm_trans.rent_payment_already_finalized)

        if prc.owner_user_id != party.user_id:
            raise PermissionException(perm_trans.party_is_not_contract_owner)

    def party_has_perm_to_reject(self, prc: PropertyRentContract, party: ContractParty) -> None:
        if prc.status != ContractStatus.ACTIVE:
            raise PermissionException(perm_trans.contract_is_not_editable)
        if prc.owner.user_id == party.user_id:
            raise PermissionException(perm_trans.contract_owner_cannot_reject_contract)

    def party_has_perm_to_update_property_information(
        self, prc: PropertyRentContract, party: ContractParty, state: PRContractState
    ) -> None:
        if not self.party_is_landlord(party):
            raise PermissionException(perm_trans.party_is_not_landlord)
        if self.owner_is_landlord(prc.owner) and prc.status != PRContractState.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)
        if self.owner_is_tenant(prc.owner) and state != PRContractState.PENDING_LANDLORD_INFORMATION:
            raise PermissionException(perm_trans.contract_is_not_editable)

    def tenant_has_perm_to_sign(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if not self.party_is_tenant(party):
            raise PermissionException(perm_trans.party_is_not_tenant)
        if self.owner_is_landlord(prc.owner) and not steps.issuperset(
            self.step_manager.required_steps_for_tenant_signature__landlord_owner
        ):
            raise PermissionException(perm_trans.missing_required_steps)
        if self.owner_is_tenant(prc.owner) and not steps.issuperset(
            self.step_manager.required_steps_for_tenant_signature__tenant_owner
        ):
            raise PermissionException(perm_trans.missing_required_steps)

    def landlord_has_perm_to_sign(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if not self.party_is_landlord(party):
            raise PermissionException(perm_trans.party_is_not_landlord)
        if self.owner_is_landlord(prc.owner) and not steps.issuperset(
            self.step_manager.required_steps_for_landlord_signature__landlord_owner
        ):
            raise PermissionException(perm_trans.missing_required_steps)
        if self.owner_is_tenant(prc.owner) and not steps.issuperset(
            self.step_manager.required_steps_for_landlord_signature__tenant_owner
        ):
            raise PermissionException(perm_trans.missing_required_steps)

    def party_has_perm_to_update_tenant_information(
        self, prc: PropertyRentContract, party: ContractParty, state: PRContractState
    ) -> None:
        if not self.party_is_tenant(party):
            raise PermissionException(perm_trans.party_is_not_tenant)
        if self.owner_is_landlord(prc.owner) and state != PRContractState.PENDING_TENANT_INFORMATION:
            raise PermissionException(perm_trans.contract_is_not_editable)
        if self.owner_is_tenant(prc.owner) and state != PRContractState.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)

    def party_has_perm_to_approve(
        self, party: ContractParty, state: PRContractState, steps: set[PRContractStep]
    ) -> None:

        if not self.party_is_tenant(party):
            raise PermissionException(perm_trans.party_is_not_tenant)

        if state != PRContractState.PENDING_TENANT_APPROVAL:
            raise PermissionException(perm_trans.contract_is_not_editable)

        if not steps.issuperset(self.step_manager.required_steps_for_tenant_approve):
            raise PermissionException(perm_trans.missing_required_steps)

    def party_has_perm_to_update_landlord_information(
        self, prc: PropertyRentContract, party: ContractParty, state: PRContractState
    ) -> None:
        if not self.party_is_landlord(party):
            raise PermissionException(perm_trans.party_is_not_landlord)

        if self.owner_is_landlord(prc.owner) and not self.party_is_owner(party, prc.owner):
            raise PermissionException(perm_trans.party_is_not_contract_owner)

        if self.owner_is_tenant(prc.owner) and state != PRContractState.PENDING_LANDLORD_INFORMATION:
            raise PermissionException(perm_trans.contract_is_not_editable)

    def party_has_perm_to_pay_tenant_commission(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if not self.party_is_tenant(party):
            raise PermissionException(perm_trans.party_is_not_tenant)
        if prc.status != ContractStatus.PENDING_COMMISSION:
            raise PermissionException(perm_trans.missing_required_steps)
        if not steps.issuperset(self.step_manager.required_steps_for_paying_commission):
            raise PermissionException(perm_trans.missing_required_steps)

    def party_has_perm_to_pay_landlord_commission(
        self, prc: PropertyRentContract, party: ContractParty, steps: set[PRContractStep]
    ) -> None:
        if not self.party_is_landlord(party):
            raise PermissionException(perm_trans.party_is_not_landlord)
        if prc.status != ContractStatus.PENDING_COMMISSION:
            raise PermissionException(perm_trans.missing_required_steps)
        if not steps.issuperset(self.step_manager.required_steps_for_paying_commission):
            raise PermissionException(perm_trans.missing_required_steps)

    def validate_party_has_perm_to_delete_payment(self, prc: PropertyRentContract, party: ContractParty) -> None:
        if prc.status == ContractStatus.ADMIN_REJECTED or prc.status == ContractStatus.PARTY_REJECTED:
            raise PermissionException(perm_trans.rejected_contract_cannot_changes)

        if prc.status != ContractStatus.DRAFT:
            raise PermissionException(perm_trans.contract_is_not_editable)

        if prc.owner.user_id != party.user_id:
            raise PermissionException(perm_trans.party_is_not_contract_owner)

    def validate_party_has_perm_for_edit_request(
        self, prc: PropertyRentContract, party: ContractParty, state: PRContractState
    ) -> None:
        if prc.owner_user_id == party.user_id:
            raise PermissionException(perm_trans.contract_owner_cannot_edit_request)

    def validate_party_and_counter_party_are_not_same(self, party_user: User, counter_party_user: User) -> None:
        if party_user.mobile == counter_party_user.mobile:
            raise ConflictException(ConflictExcTrans.party_and_counter_party_are_same)

        if party_user.national_code == counter_party_user.national_code:
            raise ConflictException(ConflictExcTrans.party_and_counter_party_are_same)

    def validate_user_is_contract_party(self, user: User, parties: list[ContractParty]) -> None:
        for party in parties:
            if party.user_id == user.id:
                return
        raise UserIsNotContractPartyException

    def party_is_owner(self, party: ContractParty, owner: ContractOwner) -> bool:
        return party.user_id == owner.user_id

    def party_is_tenant(self, party: ContractParty) -> bool:
        return party.party_type == PartyType.TENANT

    def party_is_landlord(self, party: ContractParty) -> bool:
        return party.party_type == PartyType.LANDLORD

    def owner_is_tenant(self, owner: ContractOwner) -> bool:
        return owner.party_type == PartyType.TENANT

    def owner_is_landlord(self, owner: ContractOwner) -> bool:
        return owner.party_type == PartyType.LANDLORD
