from shared.entrypoints.views.file_download import file_download_view
from shared.entrypoints.views.province_cities_list import all_province_cities_view
from shared.entrypoints.views.provinces_list import all_provinces_view

from .cities_list_view import all_cities_view
from .city_detail import city_detail_view
from .districts_list_view import all_city_districts_view
from .file_detail import file_detail_view

__all__ = [
    "all_cities_view",
    "file_detail_view",
    "all_city_districts_view",
    "file_download_view",
    "all_provinces_view",
    "all_province_cities_view",
    "city_detail_view",
]
