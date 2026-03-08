from contract.domain.prcontract.prcontract_commission_service import (
    PRContractCommissionService,
)
from contract.service_layer.dtos import CalculateSaleCommissionDto


def calculate_sale_commission_handler(
    command: CalculateSaleCommissionDto, commission_service: PRContractCommissionService
):
    sale_commission = commission_service.calculate_sale_commission(
        sale_amount=command.sale_price, province_type=command.city
    )
    sale_commission_tax = commission_service.calculate_tax(total_amount=sale_commission)

    return {
        "commission": sale_commission,
        "tax": sale_commission_tax,
        "total": (sale_commission + sale_commission_tax),
    }
