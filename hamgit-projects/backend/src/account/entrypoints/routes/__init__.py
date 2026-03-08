from fastapi import APIRouter

from .admin_routes import router as admin
from .auth_routes import router as auth
from .bank_accounts_routes import router as bank_account
from .user_routes import router as user

router = APIRouter()
router.include_router(auth)
router.include_router(user)
router.include_router(bank_account)
router.include_router(admin)
