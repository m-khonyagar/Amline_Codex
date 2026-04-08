import abc
import datetime as dt
from dataclasses import dataclass

import jwt

from account.domain.entities.refresh_token import RefreshToken
from account.domain.entities.user import User
from core import exceptions, helpers
from core.translates import auth_trans
from core.types import JWTConfig
from shared.service_layer.exceptions import InvalidTokenException, TokenRevokedException
from shared.service_layer.services.cache_service import CacheService
from unit_of_work import UnitOfWork


@dataclass
class Payload:
    sub: int
    type: str
    ip: str
    exp: dt.datetime

    def dumps(self) -> dict:
        return {
            "sub": str(self.sub),
            "type": self.type,
            "ip": self.ip,
            "exp": self.exp.timestamp(),
        }

    @classmethod
    def loads(cls, data: dict) -> "Payload":
        return cls(
            sub=int(data["sub"]),
            type=data["type"],
            ip=data["ip"],
            exp=dt.datetime.fromtimestamp(data["exp"]),
        )


class TokenService(abc.ABC):

    @abc.abstractmethod
    def generate_access_token(self, user_id: int) -> str:
        """Create an access token."""
        raise NotImplementedError

    @abc.abstractmethod
    def generate_refresh_token(self, user_id: int) -> str:
        """Create a refresh token."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_user_from_token(self, token: str) -> User:
        """Decode a token and return the user."""
        raise NotImplementedError

    @abc.abstractmethod
    def revoke_access_token(self, access_token: str) -> None:
        """Revoke an access token."""
        raise NotImplementedError

    @abc.abstractmethod
    def revoke_refresh_token(self, refresh_token: str) -> None:
        """Revoke a refresh token."""
        raise NotImplementedError

    @abc.abstractmethod
    def validate_access_token(self, access_token: str) -> bool:
        """Validate an access token."""
        raise NotImplementedError

    @abc.abstractmethod
    def validate_refresh_token(self, refresh_token: str) -> bool:
        """Validate a refresh token."""
        raise NotImplementedError

    @abc.abstractmethod
    def extract_token_from_authorization_header(self, authorization: str | None) -> str:
        """Extract the token from an authorization header."""
        raise NotImplementedError


class JwtTokenService(TokenService):

    def __init__(self, cache: CacheService, uow: UnitOfWork, config: JWTConfig, client_ip: str):
        self.cache = cache
        self.uow = uow
        self.secret_key = config.secret_key
        self.access_expire = config.access_expire
        self.refresh_expire = config.refresh_expire
        self.algorithm = config.algorithm
        self.client_ip = client_ip

    def generate_access_token(self, user_id: int) -> str:
        exp = self._calculate_access_token_expiration()
        # exp = dt.datetime(year=2026, month=1, day=1)
        payload = Payload(sub=user_id, type="access", ip=self.client_ip, exp=exp)
        return jwt.encode(payload.dumps(), self.secret_key, algorithm=self.algorithm)

    def generate_refresh_token(self, user_id: int) -> str:
        self.uow.execute(
            "UPDATE account.refresh_tokens SET is_revoked = true WHERE id = :user_id",
            user_id=user_id,
        )

        exp = self._calculate_refresh_token_expiration()
        payload = Payload(sub=user_id, type="refresh", ip=self.client_ip, exp=exp)
        token = jwt.encode(payload.dumps(), self.secret_key, algorithm=self.algorithm)
        refresh_token_obj = RefreshToken(token=token, user_id=user_id, expires_at=exp)

        with self.uow:
            self.uow.refresh_tokens.add(refresh_token_obj)
            self.uow.commit()
            return token

    def get_user_from_token(self, token: str) -> User:
        payload = self._decode_token(token)
        user_id = payload.sub
        return self._get_user(user_id=user_id)

    def revoke_access_token(self, access_token: str) -> None:
        self.cache.set(key=access_token, value="revoked", exp=dt.timedelta(minutes=self.access_expire))

    def revoke_refresh_token(self, refresh_token: str) -> None:
        with self.uow:
            refresh_token_exists = self.uow.refresh_tokens.get_by_token(token=refresh_token)
            if not refresh_token_exists:
                raise exceptions.AuthenticationException(auth_trans.refresh_token_does_not_exist)
            refresh_token_exists.revoke()
            self.uow.commit()

    def extract_token_from_authorization_header(self, authorization: str | None) -> str:

        if not authorization:
            raise exceptions.AuthenticationException(auth_trans.missing_authorization_header)

        parts = authorization.split(" ")

        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationException(auth_trans.invalid_authorization_header)

        return parts[1]

    def validate_access_token(self, access_token: str) -> bool:
        return self.cache.get(key=access_token) is None

    def validate_refresh_token(self, refresh_token: str) -> bool:
        with self.uow:
            refresh_token_exists = self.uow.refresh_tokens.get_by_token(token=refresh_token)
            if not refresh_token_exists:
                return False
            return refresh_token_exists.is_valid

    def _get_user(self, user_id: int) -> User:
        with self.uow:
            user = self.uow.users.get(id=user_id)
            if not user:
                raise exceptions.AuthenticationException(auth_trans.user_does_not_exist)
            try:
                avatar_file = self.uow.files.get_or_raise(id=user.avatar_file_id)
                user.avatar_file = avatar_file.dumps()
            except Exception:
                pass
            return user

    def _decode_token(self, token: str) -> Payload:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return Payload.loads(payload)
        except KeyError:
            raise InvalidTokenException
        except jwt.ExpiredSignatureError:
            raise TokenRevokedException
        except jwt.InvalidTokenError:
            raise InvalidTokenException

    def _calculate_access_token_expiration(self) -> dt.datetime:
        return helpers.get_now() + dt.timedelta(minutes=self.access_expire)

    def _calculate_refresh_token_expiration(self) -> dt.datetime:
        return helpers.get_now() + dt.timedelta(minutes=self.refresh_expire)
