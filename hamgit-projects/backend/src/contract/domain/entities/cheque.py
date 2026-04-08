import datetime as dt

from contract.domain.enums import ChequeCategory, ChequePayeeType, ChequeStatus
from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.translates import validation_trans


class Cheque(BaseEntity):
    id: int
    payment_id: int
    serial: str  # سریال شماره چک
    series: str  # سری شماره جک
    sayaad_code: str  # شناسه صیاد
    image_file_id: int  # عکس چک
    category: ChequeCategory  # دسته بندی چک
    payee_type: ChequePayeeType  # شخصی حقیقی، شخص حقوقی، اتباع
    payee_national_code: str
    status: ChequeStatus  # وضعیت چک
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        payment_id: int,
        serial: str,
        series: str,
        sayaad_code: str,
        image_file_id: int,
        category: ChequeCategory,
        payee_type: ChequePayeeType,
        payee_national_code: str,
        status: ChequeStatus = ChequeStatus.PENDING,
    ) -> None:
        self._validate_national_code(national_code=payee_national_code)
        self._validate_sayaad_code(sayaad_code=sayaad_code)
        self.id = self.next_id
        self.payment_id = payment_id
        self.serial = serial
        self.series = series
        self.sayaad_code = sayaad_code
        self.image_file_id = image_file_id
        self.category = category
        self.payee_type = payee_type
        self.payee_national_code = payee_national_code
        self.status = status

    def update(
        self,
        serial: str,
        series: str,
        sayaad_code: str,
        image_file_id: int,
        category: ChequeCategory,
        payee_type: ChequePayeeType,
        payee_national_code: str,
        status: ChequeStatus,
    ) -> None:
        self._validate_national_code(national_code=payee_national_code)
        self._validate_sayaad_code(sayaad_code=sayaad_code)
        self.serial = serial
        self.series = series
        self.sayaad_code = sayaad_code
        self.image_file_id = image_file_id
        self.category = category
        self.payee_type = payee_type
        self.payee_national_code = payee_national_code
        self.status = status

    def _validate_national_code(self, national_code: str) -> None:
        if not national_code.isdigit():
            raise ValidationException(validation_trans.national_code_invalid_characters)
        if len(national_code) != 10:
            raise ValidationException(validation_trans.national_code_invalid_length)

    def _validate_sayaad_code(self, sayaad_code: str) -> None:
        if not sayaad_code.isdigit():
            raise ValidationException(validation_trans.sayaad_code_invalid_characters)
        if len(sayaad_code) != 16:
            raise ValidationException(validation_trans.sayaad_code_length_should_be_16)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            payment=kwargs.pop("payment", {"id": str(self.payment_id)}),
            serial=self.serial,
            series=self.series,
            sayaad_code=self.sayaad_code,
            image_file=kwargs.pop("image_file", {"id": str(self.image_file_id)}),
            category=self.category,
            payee_type=self.payee_type,
            payee_national_code=self.payee_national_code,
            status=self.status,
            **kwargs,
        )
