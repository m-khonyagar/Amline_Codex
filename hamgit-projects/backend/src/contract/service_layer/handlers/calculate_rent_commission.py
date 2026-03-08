from contract.domain.prcontract.prcontract_commission_service import (
    PRContractCommissionService,
)
from contract.service_layer.dtos import CalculateRentCommissionDto


def calculate_rent_commission_handler(
    command: CalculateRentCommissionDto, commission_service: PRContractCommissionService
) -> dict:
    commission = commission_service.calculate_commission(
        deposit_amount=command.security_deposit_amount, rent_amount=command.rent_amount
    )
    tax_amount = commission_service.calculate_tax(total_amount=commission)
    return {
        "tax": tax_amount,
        "commission": commission,
        "total": tax_amount + commission,
    }
