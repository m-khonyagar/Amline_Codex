import requests  # type: ignore

from contract.service_layer.dtos import CalculateRentCommissionDto
from core import settings
from core.exceptions import ProcessingException
from core.logger import Logger

logger = Logger(__name__)


def get_post_info_handler(token: str):
    response = requests.get(
        f"{settings.kenar_divar_urls.post_info}{token}", headers={"X-Api-Key": settings.KENAR_DIVAR_API_KEY}
    )
    if response.status_code != 200:
        logger.error(f"Error fetching Kenar Divar post info: {response.status_code} - {response.text}")
        raise ProcessingException(detail="Failed to fetch Kenar Divar post info")
    try:
        result = response.json()["data"]["transformable_price"]
        return CalculateRentCommissionDto(
            security_deposit_amount=result["credit"],
            rent_amount=result["rent"],
        )
    except Exception as e:
        logger.error(f"Error processing Kenar Divar API response: {e}")
        raise ProcessingException(detail="Invalid response format from Kenar Divar API")
