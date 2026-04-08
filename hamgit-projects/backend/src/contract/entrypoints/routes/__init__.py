from fastapi import APIRouter

from .admin_contract_routes import router as admin_contract_router
from .admin_prcontract_routes import router as admin
from .contract_routes import router as contract_router
from .payment_routes import router as payment_router
from .prcontract_routes import router as prcontract_router

router = APIRouter()
router.include_router(payment_router)
router.include_router(contract_router)
router.include_router(prcontract_router)
router.include_router(admin_contract_router)
router.include_router(admin)
