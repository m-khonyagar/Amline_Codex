import base64
import io
from dataclasses import dataclass
from typing import List
import qrcode
from itertools import groupby

from pdf_generator.contracts import entities, enums
from pdf_generator.contracts.pr_contract_qr_code import generate_qr_code
from pdf_generator.generator_abstract import GeneratorAbstract
from pdf_generator.contracts.translates import Translations


class PRContractPDFGenerator(GeneratorAbstract):
    def __init__(self, contract: entities.PRContract):
        self.contract = contract

    @property
    def views_path(self) -> str:
        return "views"

    @property
    def template_path(self) -> str:
        return "pr_contract/index.html"

    @property
    def css_path(self) -> str:
        return "pr_contract/style.css"

    @property
    def translations(self):
        return Translations

    def get_data(self) -> dataclass:
        deposit_payments = [
            p for p in self.contract.payments if p.type == enums.PaymentType.DEPOSIT
        ]
        rent_payments = [
            p for p in self.contract.payments if p.type == enums.PaymentType.RENT
        ]
        monthly_rent_payment = next(
            (
                p
                for p in self.contract.payments
                if p.type == enums.PaymentType.RENT and p.is_bulk
            ),
            None,
        )

        tenant = self.contract.tenant
        landlord = self.contract.landlord

        qr_base64 = None

        if self.contract.id and self.contract.password:
            qr_base64 = generate_qr_code(
                id=self.contract.id, password=self.contract.password
            )

        group_clauses = groupby(
            sorted(
                self.contract.clauses,
                key=lambda c: (c.clause_number, c.subclause_number),
            ),
            key=lambda x: x.clause_number,
        )

        return dict(
            tenant=tenant,
            landlord=landlord,
            qr_base64=qr_base64,
            clauses=self.contract.clauses,
            group_clauses=group_clauses,
            property=self.contract.property,
            contract=self.contract,
            rent_payments=rent_payments,
            deposit_payments=deposit_payments,
            monthly_rent_payment=monthly_rent_payment,
        )
