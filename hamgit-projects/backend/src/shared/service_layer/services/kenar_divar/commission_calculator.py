from contract.domain.prcontract.prcontract_commission_service import (
    PRContractCommissionService,
)
from contract.service_layer.dtos import CalculateRentCommissionDto
from contract.service_layer.handlers.calculate_rent_commission import (
    calculate_rent_commission_handler,
)
from shared.service_layer.services.kenar_divar.get_post_info import (
    get_post_info_handler,
)


def kenar_divar_commission_calculator_handler(token: str):
    commission_service = PRContractCommissionService(amline_user_id=0)
    data: CalculateRentCommissionDto = get_post_info_handler(token=token)
    return {
        "deposit_amount": data.security_deposit_amount,
        "rent_amount": data.rent_amount,
        "commission": calculate_rent_commission_handler(command=data, commission_service=commission_service),
    }
