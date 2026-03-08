from fastapi import APIRouter

from .admin_wallet_routes import router as admin_wallet_router
from .invoice_routes import router as invoice_router
from .wallet_routes import router as wallet_router

router = APIRouter()
router.include_router(invoice_router)
router.include_router(wallet_router)
router.include_router(admin_wallet_router)
