from dataclasses import asdict
from typing import Literal

from account.domain.entities.bank_account import BankAccount
from account.domain.entities.user import User
from account.domain.enums import UserRole
from contract.domain import enums
from contract.domain.entities.contract_step import ContractStep
from contract.service_layer import dtos
from core.exceptions import ValidationException
from core.helpers import generate_random_otp, get_now, validate_mobile_number
from shared.domain.entities.property import Property
from shared.service_layer.services.sms_service import SMSService
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


def send_otp(mobile: str, sms_service: SMSService) -> bool:
    validated_mobile = validate_mobile_number(mobile)
    otp = generate_random_otp()
    sms_service.send_otp(mobile=validated_mobile, otp=str(otp))
    return True


def upsert_user(person: dtos.UserInfo, user_verifier: UserVerifierService, uow: UnitOfWork) -> dict:
    try:
        return _create_or_update_user(person, user_verifier, uow)
    except Exception as e:
        raise ValidationException(str(e))


def create_property(contract_id: int, property_info: dtos.PropertyInfo, uow: UnitOfWork) -> Property:
    try:
        with uow:
            steps = []
            pr_contract = uow.prcontracts.get_or_raise(contract_id=contract_id)
            owner_user = uow.users.get_or_raise(id=pr_contract.owner_user_id)

            property = Property(
                owner_user_id=owner_user.id,
                owner_user_role=owner_user.roles[0],
                property_type=property_info.property_type,
                deed_status=property_info.deed_status,
                city_id=property_info.city_id,
                registration_area=property_info.registration_area,
                main_register_number=property_info.main_register_number,
                sub_register_number=property_info.sub_register_number,
                postal_code=property_info.postal_code,
                address=property_info.address,
                area=property_info.area,
                build_year=property_info.build_year,
                structure_type=property_info.structure_type,
                facade_types=property_info.facade_types,
                direction_type=property_info.direction_type,
                flooring_types=property_info.flooring_types,
                is_rebuilt=property_info.is_rebuilt,
                restroom_type=property_info.restroom_type,
                heating_system_types=property_info.heating_system_types,
                cooling_system_types=property_info.cooling_system_types,
                kitchen_type=property_info.kitchen_type,
                water_supply_type=property_info.water_supply_type,
                electricity_supply_type=property_info.electricity_supply_type,
                gas_supply_type=property_info.gas_supply_type,
                sewage_supply_type=property_info.sewage_supply_type,
                number_of_rooms=property_info.number_of_rooms,
                parking=property_info.parking,
                parking_number=property_info.parking_number,
                landline=property_info.landline,
                landline_number=property_info.landline_number,
                storage_room=property_info.storage_room,
                storage_room_number=property_info.storage_room_number,
                storage_room_area=property_info.storage_room_area,
                other_facilities=property_info.other_facilities,
                description=property_info.description,
            )
            uow.properties.add(property)

            steps.append(ContractStep(contract_id, enums.PRContractStep.PROPERTY_DETAILS, completed_at=get_now()))
            steps.append(ContractStep(contract_id, enums.PRContractStep.PROPERTY_FACILITIES, completed_at=get_now()))
            steps.append(
                ContractStep(contract_id, enums.PRContractStep.PROPERTY_SPECIFICATIONS, completed_at=get_now())
            )
            uow.contract_steps.add_all(steps)
            uow.flush()

            pr_contract.property_id = property.id
            uow.commit()
            uow.properties.refresh(property)

            return property

    except Exception as e:
        raise ValidationException(str(e))


# def finalize_contract_creation(contract_id: int, prc_pdf_generator: PRContractPDFGeneratorService, uow: UnitOfWork):
#     try:
#         with uow:
#             contract = uow.contracts.get_or_raise(id=contract_id)
#             contract.completed_at = get_now()
#             contract.status = enums.ContractStatus.COMPLETED

#             pr_contract = uow.prcontracts.get_or_raise(contract_id=contract_id)
#             pr_contract.state = enums.PRContractState.PENDING_TRACKING_CODE_REQUEST
#             pr_contract.status = enums.ContractStatus.COMPLETED
#             pr_contract.steps = _generate_prcontract_steps(contract.id, "FULL", uow)

#             try:
#                 pr_contract.pdf_file_id = prc_pdf_generator.generate_pdf(contract.id)["id"]
#                 pdf_status = "and pdf generated successfully"

#             except Exception:
#                 pdf_status = "but pdf generation failed"

#             uow.commit()

#         return {"message": "Contract created " + pdf_status}

#     except Exception as e:
#         raise ValidationException(str(e))


def _create_or_update_user(person: dtos.UserInfo, user_verifier: UserVerifierService, uow: UnitOfWork) -> dict:

    with uow:
        user_data = asdict(person)
        user_data.pop("verify_identity")

        if user := uow.users.get_by_mobile(person.mobile):
            user_data.pop("mobile")
            user.update(**user_data)
        else:
            user = User(**user_data)
            uow.users.add(user)

        uow.commit()
        uow.users.refresh(user)

        result = user.dumps()
        result["verification_data"] = _validate_user_info(user, user_verifier) if person.verify_identity else None

        return result


def _validate_user_info(user: User, user_verifier: UserVerifierService) -> dict:

    try:
        return user_verifier.verify_user_info(user.national_code, user.birth_date, user.mobile)  # type: ignore
    except Exception as e:
        return {"error": str(e)}


def _create_or_update_bank_account(user_id: int, iban: str, iban_name: str, uow: UnitOfWork) -> BankAccount:

    if user_bank_account := uow.bank_accounts.get_by_iban_and_user(
        iban=iban, user_id=user_id, user_role=UserRole.PERSON
    ):
        user_bank_account.update(iban=iban, owner_name=iban_name)
    else:
        user_bank_account = BankAccount(user_id=user_id, iban=iban, owner_name=iban_name)
        uow.bank_accounts.add(user_bank_account)

    return user_bank_account


def _generate_prcontract_steps(
    contract_id: int, status: Literal["FULL", "PENDING_SIGNATURE", "PENDING_COMMISSION"], uow: UnitOfWork
) -> list[ContractStep]:

    exclusions = ["REJECT", "FAILED", "EDIT"]
    try:
        existing_steps = uow.contract_steps.get_by_contract_id(contract_id)
        existing_step_types = [step.type for step in existing_steps] if existing_steps else []
    except Exception:
        existing_step_types = []

    match status:
        case "PENDING_COMMISSION":
            exclusions.extend(["PROPERTY", "PAYMENT", "COMMISSION", "TRACKING", "ADMIN"])
        case "PENDING_SIGNATURE":
            exclusions.extend(["PROPERTY", "PAYMENT", "COMMISSION", "SIGNATURE", "TRACKING", "ADMIN"])

    steps = [e.value for e in enums.PRContractStep if not any(word in e.value for word in exclusions)]
    result = [
        ContractStep(contract_id, step, completed_at=get_now()) for step in steps if step not in existing_step_types
    ]

    uow.contract_steps.add_all(result)

    return result
