import datetime as dt

from account.domain.enums import Gender, UserRole
from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.translates import ValidationExcTrans
from financial.domain.entities.wallet import Wallet


class User(BaseEntity):
    id: int
    mobile: str
    roles: list[UserRole]
    first_name: str | None
    last_name: str | None
    father_name: str | None
    birth_date: dt.date | None
    national_code: str | None
    gender: Gender | None
    nick_name: str | None
    postal_code: str | None
    email: str | None
    address: str | None
    avatar_file_id: int | None
    default_city_id: int | None
    is_active: bool
    is_verified: bool | None
    last_login: dt.datetime | None
    eitaa_user_id: str | None

    label_ids: list[int]

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    _avatar_file: dict | None = None

    wallet: Wallet | None = None

    def __init__(
        self,
        mobile: str,
        roles: list[UserRole] = [UserRole.PERSON],
        national_code: str | None = None,
        is_active: bool = True,
        **kwargs,
    ):
        self._validate_national_code(national_code)
        self.id = self.next_id
        self.mobile = mobile
        self.roles = roles
        self.national_code = national_code
        self.is_active = is_active
        self._set(**kwargs)

    def _set(self, **kwargs) -> None:
        for key, value in kwargs.items():
            if value is not None:
                setattr(self, key, value)

    @property
    def avatar_file(self) -> dict | None:
        if not self.avatar_file_id:
            return None
        elif self.avatar_file_id and not self._avatar_file:
            return {"id": str(self.avatar_file_id)}
        return self._avatar_file

    @avatar_file.setter
    def avatar_file(self, avatar_file: dict) -> None:
        self._avatar_file = avatar_file

    @property
    def is_admin(self) -> bool:
        return UserRole.SUPERUSER in self.roles or UserRole.STAFF in self.roles

    @property
    def is_contract_admin(self) -> bool:
        return any(
            role in self.roles
            for role in [
                UserRole.SUPERUSER,
                UserRole.STAFF,
                UserRole.CONTRACT_ADMIN,
            ]
        )

    @property
    def is_admin_panel_user(self) -> bool:
        return any(
            role in self.roles
            for role in [
                UserRole.SUPERUSER,
                UserRole.STAFF,
                UserRole.CONTRACT_ADMIN,
                UserRole.AUDITOR,
                UserRole.AD_MODERATOR,
            ]
        )

    @property
    def is_superuser(self) -> bool:
        return UserRole.SUPERUSER in self.roles

    @property
    def fullname(self) -> str:
        return " ".join(n for n in [self.first_name, self.last_name] if n)

    @property
    def fullname_or_mobile(self) -> str:
        return self.fullname or self.mobile

    def update(
        self,
        first_name: str | None = None,
        last_name: str | None = None,
        father_name: str | None = None,
        birth_date: dt.date | None = None,
        national_code: str | None = None,
        is_verified: bool | None = None,
        gender: Gender | None = None,
        nick_name: str | None = None,
        postal_code: str | None = None,
        email: str | None = None,
        address: str | None = None,
        avatar_file_id: int | None = None,
        default_city_id: int | None = None,
        roles: list[UserRole] | None = None,
        label_ids: list[int] | None = None,
        **kwargs,
    ) -> None:
        self._validate_national_code(national_code)
        self._validate_birth_date(birth_date)
        self._validate_postal_code(postal_code)

        if not self.is_verified:
            self.first_name = first_name or self.first_name
            self.last_name = last_name or self.last_name
            self.father_name = father_name or self.father_name
            self.birth_date = birth_date or self.birth_date
            self.national_code = national_code or self.national_code

        self.is_verified = is_verified if is_verified is not None else self.is_verified
        self.gender = gender or self.gender
        self.nick_name = nick_name or self.nick_name
        self.postal_code = postal_code or self.postal_code
        self.email = email or self.email
        self.address = address or self.address
        self.avatar_file_id = avatar_file_id or self.avatar_file_id
        self.default_city_id = default_city_id or self.default_city_id
        self.roles = roles or self.roles
        self.label_ids = label_ids or self.label_ids

    def deactivate(self) -> None:
        self.is_active = False
        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    def reset_last_login(self) -> None:
        self.last_login = dt.datetime.now(tz=dt.timezone.utc)

    def add_role(self, role: UserRole) -> None:
        if role in self.roles:
            return
        self.roles.append(role)

    def _validate_national_code(self, national_code: str | None) -> None:
        if national_code is not None and (not national_code.isdigit() or len(national_code) != 10):
            raise ValidationException(ValidationExcTrans.invalid_national_code)

    def _validate_birth_date(self, birth_date: dt.date | None) -> None:
        if birth_date is not None and birth_date > dt.date.today():
            raise ValidationException(ValidationExcTrans.birth_date_is_in_future)

    def _validate_postal_code(self, postal_code: str | None) -> None:
        if postal_code is not None and (not postal_code.isdigit() or len(postal_code) != 10):
            raise ValidationException(ValidationExcTrans.invalid_postal_code)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            mobile=self.mobile,
            roles=[UserRole.resolve(role) for role in self.roles],
            first_name=self.first_name,
            last_name=self.last_name,
            father_name=self.father_name,
            birth_date=self.birth_date.isoformat() if self.birth_date else None,
            national_code=self.national_code,
            gender=Gender.safe_resolve(self.gender),
            nick_name=self.nick_name,
            postal_code=self.postal_code,
            email=self.email,
            address=self.address,
            avatar_file=self.avatar_file,
            is_active=self.is_active,
            is_verified=self.is_verified,
            label_ids=[str(label_id) for label_id in self.label_ids] if self.label_ids else None,
            last_login=self.last_login.isoformat() if self.last_login else None,
            created_at=self.created_at.isoformat(),
            wallet=self.wallet.dumps() if self.wallet else None,
            **kwargs,
        )

    def short_dumps(self) -> dict:
        return dict(
            id=str(self.id),
            fullname=self.fullname,
        )

    def __repr__(self) -> str:
        return self.fullname_or_mobile

    @classmethod
    def loads(cls, data: dict) -> "User":
        user = cls(
            mobile=data["mobile"],
            roles=[UserRole.resolve(role) for role in data["roles"]],
            national_code=data["national_code"],
            is_active=data["is_active"],
        )
        user.id = int(data["id"])
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.father_name = data["father_name"]
        user.birth_date = dt.date.fromisoformat(data["birth_date"]) if data["birth_date"] else None
        user.gender = Gender.safe_resolve(data["gender"])
        user.nick_name = data["nick_name"]
        user.postal_code = data["postal_code"]
        user.email = data["email"]
        user.address = data["address"]
        user.avatar_file_id = int(data.get("avatar_file", {}).get("id"))
        user._avatar_file = data["avatar_file"]
        user.is_verified = data["is_verified"]
        user.last_login = dt.datetime.fromisoformat(data["last_login"]) if data["last_login"] else None
        return user
