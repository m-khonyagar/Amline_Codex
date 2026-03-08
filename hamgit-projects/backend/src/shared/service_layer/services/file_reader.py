from io import BytesIO
from logging import Logger

import pandas as pd
from fastapi import UploadFile

logger = Logger(__name__)


class FileReader:

    @staticmethod
    async def excel(file: UploadFile) -> list[dict] | None:
        if not file.filename or file.filename.split(".")[1] != "xlsx":
            return None
        try:
            content = await file.read()
            excel_data = pd.read_excel(BytesIO(content))
            return excel_data.to_dict(orient="records")
        except Exception as e:
            logger.error(e)
            return None
