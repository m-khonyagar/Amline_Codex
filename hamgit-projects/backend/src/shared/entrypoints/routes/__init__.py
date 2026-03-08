from fastapi import APIRouter

from .city_routes import router as city
from .file_routes import router as file
from .metabase_routes import router as metabase

router = APIRouter()

router.include_router(file)
router.include_router(city)
router.include_router(metabase)
