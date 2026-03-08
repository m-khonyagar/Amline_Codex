from fastapi import APIRouter

from .file_call_routes import router as file_call_router
from .file_connection_routes import router as file_connection_router
from .file_text_routes import router as file_text_router
from .landlord_file_routes import router as landlord_file_router
from .realtor_file_routes import router as realtor_file_router
from .tenant_file_routes import router as tenant_file_router
from .tools_routes import router as ajax_router

router = APIRouter(prefix="/crm")
router.include_router(landlord_file_router)
router.include_router(tenant_file_router)
router.include_router(realtor_file_router)
router.include_router(file_text_router)
router.include_router(file_call_router)
router.include_router(file_connection_router)
router.include_router(ajax_router)
