from fastapi import APIRouter

from .admin_routes import router as admin_router
from .ads_routes import router as ads_router
from .swap_ads_routes import router as swap_ads_router
from .wanted_ads_routes import router as wanted_ads_router

router = APIRouter()
router.include_router(ads_router)
router.include_router(admin_router)
router.include_router(swap_ads_router)
router.include_router(wanted_ads_router)
