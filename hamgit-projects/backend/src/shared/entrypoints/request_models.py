from pydantic import BaseModel


class KenarDivarLoginRequest(BaseModel):
    code: str
    redirect_url: str


class CreateDistrictRequestModel(BaseModel):
    name: str
    region: int | None = None


class UpdateDistrictRequestModel(BaseModel):
    city_id: int | None = None
    name: str | None = None
    region: int | None = None


class EitaaLoginRequest(BaseModel):
    response: str


class EitaaLoginWithIdRequest(BaseModel):
    eitaa_user_id: str
