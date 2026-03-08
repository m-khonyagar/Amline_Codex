from account.domain.enums import UserRole
from contract.domain.enums import PaymentType
from core.exceptions import ConflictException
from core.types import CurrentUser
from financial.domain.entities.discount import Discount
from financial.entrypoints.request_models import GenerateBulkPromoCodeRequest
from financial.service_layer.dtos import GeneratePromoCodeDto
from unit_of_work import UnitOfWork


def generate_promo_code(command: GeneratePromoCodeDto, uow: UnitOfWork, current_user: CurrentUser):
    if command.code:
        discount = uow.discounts.get(code=command.code)
        if discount:
            raise ConflictException(detail="Code already exists")
    discount = Discount.create(
        type=command.discount_type,
        value=command.value,
        resource_type=command.resource_type,
        starts_at=command.start_date,
        ends_at=command.end_date,
        specified_roles=command.roles or [UserRole.PERSON],
        specified_user_phone=command.specified_user_phone,
        usage_limit=command.usage_limit,
        created_by=current_user.id,
        prefix=command.prefix,
        code=command.code,
    )
    uow.discounts.add(discount)
    uow.flush()

    return discount


def generate_promo_code_handler(command: GeneratePromoCodeDto, uow: UnitOfWork, current_user: CurrentUser):
    with uow:
        discount = generate_promo_code(command, uow, current_user)
        uow.commit()
        uow.discounts.refresh(discount)
        return discount.dumps()


def generate_bulk_promo_code_handler(data: GenerateBulkPromoCodeRequest, uow: UnitOfWork, current_user: CurrentUser):
    with uow:
        command = GeneratePromoCodeDto(
            value=data.value,
            discount_type=data.discount_type,
            usage_limit=data.usage_limit,
            start_date=data.start_date,
            end_date=data.end_date,
            roles=data.roles,
            resource_type=data.resource_type or PaymentType.COMMISSION,
            prefix=data.prefix,
            specified_user_phone=data.specified_user_phone,
        )
        discounts = [generate_promo_code(command, uow, current_user).code for _ in range(data.count)]
        uow.commit()
        return discounts
