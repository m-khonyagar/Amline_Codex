from abc import ABC, abstractmethod
from datetime import date, datetime
from typing import TypedDict

import pytz
import requests

from core.exceptions import NotFoundException, ProcessingException
from core.logger import Logger
from core.translates.not_found_exception import NotFoundExcTrans
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork

logger = Logger("pdf-generator-service")

tehran_time_zone = pytz.timezone("Asia/Tehran")


class BankAccount(TypedDict):
    id: int
    iban: str
    owner_name: str


class BankAccounts(TypedDict):
    tenant_ba: BankAccount
    landlord_rent_ba: BankAccount
    landlord_deposit_ba: BankAccount


class Tenant(TypedDict):
    user_id: int
    mobile: str
    first_name: str
    last_name: str
    father_name: str
    national_code: str
    address: str
    signed_at: datetime
    bank_account: BankAccount
    birth_date: str | None


class Landlord(TypedDict):
    user_id: int
    mobile: str
    first_name: str
    last_name: str
    father_name: str
    national_code: str
    address: str
    signed_at: datetime
    rent_bank_account: BankAccount
    deposit_bank_account: BankAccount
    birth_date: str | None


class Clause(TypedDict):
    clause_name: str
    clause_number: int
    subclause_number: int
    subclause_name: str | None
    body: str


class Cheque(TypedDict):
    serial: str
    series: str
    sayaad_code: str
    category: str
    payee_type: str
    payee_national_code: str


class Payment(TypedDict):
    amount: int
    due_date: date
    is_bulk: bool
    description: str | None
    method: str
    type: str
    cheque: Cheque | None


class Property(TypedDict):
    property_type: str
    deed_status: str
    address: str
    city: dict
    electricity_bill_id: str | None
    postal_code: str | None
    registration_area: str | None
    main_register_number: int | None
    sub_register_number: int | None

    area: float | None
    build_year: int | None
    structure_type: str
    facade_types: list[str]
    direction_type: str
    flooring_types: list[str]
    is_rebuilt: bool | None
    elevator: bool | None

    restroom_type: str
    heating_system_types: list[str]
    cooling_system_types: list[str]
    kitchen_type: str

    water_supply_type: str
    electricity_supply_type: str
    gas_supply_type: str
    sewage_supply_type: str
    number_of_rooms: int | None
    parking: bool
    parking_number: int | None

    landline: bool
    landline_number: list[str] | None

    storage_room: bool
    storage_room_number: int | None
    storage_room_area: float | None

    other_facilities: list[str]
    description: str | None


class ContractModel(TypedDict):
    id: int
    password: str
    owner_type: str
    date: str
    handover_date: str
    start_date: str
    end_date: str
    contract_duration: int
    deposit_amount: int
    monthly_rent_amount: int
    tenant_penalty_fee: int
    landlord_penalty_fee: int
    status: str
    tenant: Tenant
    landlord: Landlord
    property: Property
    payments: list[Payment]
    clauses: list[Clause]
    tracking_code: str | None
    tenant_family_members_count: int | None


class PDFGeneratingFailed(ProcessingException):
    pass


class PRContractPDFGeneratorService(ABC):

    def generate_pdf(self, contract_id: int) -> bytes:
        """
        Create a PDF file for the given contract_id.
        """
        try:
            return self._generate_pdf(contract_id)
        except NotFoundException as exc:
            logger.error(f"pdf generation failed for contract: {contract_id}", exc)
            raise PDFGeneratingFailed(detail=exc.detail)
        except ProcessingException as exc:
            logger.error(f"pdf generation failed for contract: {contract_id}", exc)
            raise PDFGeneratingFailed(detail=exc.detail, location=exc.location)
        except Exception as exc:
            logger.error(f"pdf generation failed for contract: {contract_id}", exc)
            raise PDFGeneratingFailed(ProcessingExcTrans.failed_to_generate_pdf_file)

    @abstractmethod
    def _generate_pdf(self, contract_id: int) -> bytes:
        raise NotImplementedError


class PRContractPDFGeneratorServiceImpl(PRContractPDFGeneratorService):

    def __init__(self, service_url: str, uow: UnitOfWork) -> None:
        self.service_url = service_url
        self.uow = uow

    def _generate_pdf(self, contract_id: int) -> bytes:
        contract = self._get_contract(contract_id)
        property = self._get_property(contract["property_id"])
        clauses = self._get_clauses(contract_id)
        payments = self._get_payments(contract_id)
        bank_account_ids = {
            "tenant_ba_id": contract.pop("tenant_ba_id"),
            "landlord_rent_ba_id": contract.pop("landlord_rent_ba_id"),
            "landlord_deposit_ba_id": contract.pop("landlord_deposit_ba_id"),
        }
        parties_list = contract.pop("parties")
        bank_accounts = self._get_bank_accounts(bank_account_ids)
        tenant, landlord = self._get_parties(parties_list, bank_accounts)
        contract_duration = contract["end_date"] - contract["start_date"]
        contract_data = ContractModel(
            id=contract["id"],
            password=contract["password"],
            owner_type=contract["owner_type"],
            date=contract["date"].isoformat(),
            handover_date=contract["handover_date"].isoformat(),
            start_date=contract["start_date"].isoformat(),
            end_date=contract["end_date"].isoformat(),
            contract_duration=contract_duration.days,
            deposit_amount=contract["deposit"],
            monthly_rent_amount=contract["rent"],
            tenant_family_members_count=contract["tenant_family_members_count"],
            tenant_penalty_fee=contract["tenant_penalty_fee"],
            landlord_penalty_fee=contract["landlord_penalty_fee"],
            status=contract["status"],
            tenant=tenant,
            landlord=landlord,
            property=property,
            payments=payments,
            clauses=clauses,
            tracking_code=contract["tracking_code_value"],
        )
        response = requests.post(
            self.service_url,
            json={"contract": contract_data},
            headers={"Content-Type": "application/json", "Accept": "application/pdf"},
            timeout=100,
        )
        if response.status_code == 422:
            locations = []
            errors = response.json().get("detail", [])
            for error in errors:
                loc = error.get("loc", [])
                loc = [item for item in loc if item not in {"contract", "body"}]
                loc_str = ", ".join(loc)
                locations.append(loc_str)
            raise ProcessingException(detail=ProcessingExcTrans.contract_data_is_not_complete, location=locations)
        response.raise_for_status()
        return response.content

    def _get_parties(self, parties: list[dict], bank_accounts: BankAccounts) -> tuple[Tenant, Landlord]:
        tenant = None
        landlord = None

        for party in parties:
            signed_at_tehran = (datetime.fromisoformat(party["signed_at"]).astimezone(tehran_time_zone)).isoformat()
            if party["party_type"] == "TENANT":
                tenant = Tenant(
                    user_id=party["user_id"],
                    mobile=party["mobile"],
                    first_name=party["first_name"],
                    last_name=party["last_name"],
                    national_code=party["national_code"],
                    birth_date=party["birth_date"],
                    father_name=party["father_name"],
                    signed_at=signed_at_tehran,  # type: ignore
                    address=party["address"],
                    bank_account=bank_accounts["tenant_ba"],
                )
            elif party["party_type"] == "LANDLORD":
                landlord = Landlord(
                    user_id=party["user_id"],
                    mobile=party["mobile"],
                    first_name=party["first_name"],
                    last_name=party["last_name"],
                    national_code=party["national_code"],
                    birth_date=party["birth_date"],
                    father_name=party["father_name"],
                    signed_at=signed_at_tehran,  # type: ignore
                    address=party["address"],
                    rent_bank_account=bank_accounts["landlord_rent_ba"],
                    deposit_bank_account=bank_accounts["landlord_deposit_ba"],
                )

        if not tenant or not landlord:
            raise NotFoundException(NotFoundExcTrans.ContractParty)

        return tenant, landlord

    def _get_contract(self, contract_id: int) -> dict:
        q = """
        SELECT prc.contract_id id,
            prc.property_id property_id,
            prc.owner_party_type owner_type,
            prc.date date,
            prc.property_handover_date handover_date,
            prc.start_date start_date,
            prc.end_date end_date,
            prc.deposit_amount deposit,
            prc.rent_amount rent,
            prc.status status,
            prc.tenant_penalty_fee tenant_penalty_fee,
            prc.landlord_penalty_fee landlord_penalty_fee,
            prc.tenant_bank_account_id tenant_ba_id,
            prc.landlord_rent_bank_account_id landlord_rent_ba_id,
            prc.landlord_deposit_bank_account_id landlord_deposit_ba_id,
            prc.tracking_code_value,
            prc.tenant_family_members_count,
            c.password password,
            json_agg(
                json_build_object(
                    'user_id', u.id,
                    'party_type', cp.party_type,
                    'signed_at', cp.signed_at,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'mobile', u.mobile,
                    'national_code', u.national_code,
                    'birth_date', u.birth_date,
                    'father_name', u.father_name,
                    'address', u.address
            )) parties
        FROM contract.property_rent_contracts prc
        JOIN contract.contracts c on prc.contract_id = c.id
        LEFT JOIN contract.contract_parties cp ON prc.contract_id = cp.contract_id
        JOIN account.users u ON cp.user_id = u.id
        WHERE prc.contract_id = :contract_id AND prc.deleted_at IS NULL AND cp.deleted_at IS NULL
        GROUP BY prc.id, c.id
        """

        contract = self.uow.fetchone(q, contract_id=contract_id)
        if not contract:
            raise NotFoundException(NotFoundExcTrans.PropertyRentContract)
        return contract

    def _get_clauses(self, contract_id: int) -> list[Clause]:
        q = """
        SELECT clause_name, clause_number, subclause_number, body, subclause_name
        FROM contract.contract_clauses
        WHERE contract_id = :contract_id AND deleted_at IS NULL
        ORDER BY clause_number, subclause_number
        """
        clauses = self.uow.fetchall(q, contract_id=contract_id)
        return [
            Clause(
                clause_name=clause["clause_name"],
                clause_number=clause["clause_number"],
                subclause_number=clause["subclause_number"],
                subclause_name=clause["subclause_name"],
                body=clause["body"],
            )
            for clause in clauses
        ]

    def _get_bank_accounts(self, bank_accounts_ids: dict[str, int]) -> BankAccounts:
        q = """
        SELECT id, iban, owner_name
        FROM account.bank_accounts WHERE id = ANY(:ids) AND deleted_at IS NULL
        """
        ids: list[int] = list(bank_accounts_ids.values())
        bank_accounts = self.uow.fetchall(q, ids=ids)

        tenant_ba: BankAccount | None = None
        landlord_rent_ba: BankAccount | None = None
        landlord_deposit_ba: BankAccount | None = None

        for ba in bank_accounts:
            if ba["id"] == bank_accounts_ids["tenant_ba_id"]:
                tenant_ba = BankAccount(
                    id=ba["id"],
                    iban=ba["iban"],
                    owner_name=ba["owner_name"],
                )
            if ba["id"] == bank_accounts_ids["landlord_rent_ba_id"]:
                landlord_rent_ba = BankAccount(
                    id=ba["id"],
                    iban=ba["iban"],
                    owner_name=ba["owner_name"],
                )
            if ba["id"] == bank_accounts_ids["landlord_deposit_ba_id"]:
                landlord_deposit_ba = BankAccount(
                    id=ba["id"],
                    iban=ba["iban"],
                    owner_name=ba["owner_name"],
                )

        if not tenant_ba or not landlord_rent_ba or not landlord_deposit_ba:
            raise NotFoundException(NotFoundExcTrans.BankAccount)

        return BankAccounts(
            tenant_ba=tenant_ba,
            landlord_rent_ba=landlord_rent_ba,
            landlord_deposit_ba=landlord_deposit_ba,
        )

    def _get_payments(self, contract_id: int) -> list[Payment]:
        q = """
        SELECT p.amount, p.due_date, p.method, p.status, p.is_bulk, p.type, p.description,
        CASE
            WHEN c.serial IS NULL
            THEN NULL
            ELSE json_build_object(
                'serial', c.serial,
                'series', c.series,
                'sayaad_code', c.sayaad_code,
                'category', c.category,
                'payee_type', c.payee_type,
                'payee_national_code', c.payee_national_code
            )
        END as cheque
        FROM contract.contract_payments p
        LEFT JOIN contract.cheques c ON c.payment_id = p.id
        WHERE contract_id = :contract_id AND p.deleted_at IS NULL
        """
        payments = self.uow.fetchall(q, contract_id=contract_id)
        return [
            Payment(
                amount=payment["amount"],
                due_date=payment["due_date"].isoformat(),
                is_bulk=payment["is_bulk"],
                description=payment["description"],
                method=payment["method"],
                type=payment["type"],
                # status=payment["status"],
                cheque=payment["cheque"],
            )
            for payment in payments
        ]

    def _get_property(self, property_id: int) -> Property:
        q_property = """
        SELECT p.id, p.property_type, p.deed_status, p.registration_area, p.main_register_number,
        p.sub_register_number, p.postal_code, p.address, p.area, p.build_year, p.is_rebuilt, p.structure_type,
        p.facade_types, p.direction_type, p.flooring_types, p.restroom_type, p.heating_system_types,
        p.cooling_system_types, p.kitchen_type, p.water_supply_type, p.electricity_supply_type, p.gas_supply_type,
        p.sewage_supply_type,p.number_of_rooms, p.parking, p.parking_number, p.landline, p.landline_number,
        p.storage_room, p.storage_room_number, p.storage_room_area, p.other_facilities, p.description,
        p.electricity_bill_id, p.elevator,
        json_build_object('name', c.name, 'province', pr.name) city
        -- json_agg(json_build_object('bucket', f.bucket,'file_type', f.file_type,'name', f.name)) deed_images
        FROM shared.properties p
        LEFT JOIN shared.cities c ON p.city_id = c.id
        LEFT JOIN shared.provinces pr ON c.province_id = pr.id
        LEFT JOIN shared.files_ f ON f.id = ANY(p.deed_image_file_ids)
        WHERE p.id = :id AND p.deleted_at IS NULL
        GROUP BY p.id, c.id, pr.id
        """
        property = self.uow.fetchone(q_property, id=property_id)

        if not property:
            raise NotFoundException(NotFoundExcTrans.Property)

        return Property(
            property_type=property["property_type"],
            deed_status=property["deed_status"],
            registration_area=property["registration_area"],
            main_register_number=property["main_register_number"],
            sub_register_number=property["sub_register_number"],
            postal_code=property["postal_code"],
            address=property["address"],
            city=property["city"],
            area=property["area"],
            build_year=property["build_year"],
            structure_type=property["structure_type"],
            facade_types=property["facade_types"],
            direction_type=property["direction_type"],
            flooring_types=property["flooring_types"],
            is_rebuilt=property["is_rebuilt"],
            restroom_type=property["restroom_type"],
            heating_system_types=property["heating_system_types"],
            cooling_system_types=property["cooling_system_types"],
            kitchen_type=property["kitchen_type"],
            water_supply_type=property["water_supply_type"],
            electricity_supply_type=property["electricity_supply_type"],
            gas_supply_type=property["gas_supply_type"],
            sewage_supply_type=property["sewage_supply_type"],
            number_of_rooms=property["number_of_rooms"],
            parking=property["parking"],
            parking_number=property["parking_number"],
            landline=property["landline"],
            landline_number=property["landline_number"],
            storage_room=property["storage_room"],
            storage_room_number=property["storage_room_number"],
            storage_room_area=property["storage_room_area"],
            other_facilities=property["other_facilities"],
            electricity_bill_id=property["electricity_bill_id"],
            elevator=property["elevator"],
            description=property["description"],
        )
