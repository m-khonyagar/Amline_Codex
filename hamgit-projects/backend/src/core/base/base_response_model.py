from pydantic import BaseModel


class BaseResponse(BaseModel):
    class Config:
        arbitrary_types_allowed = True
        extra = "allow"
