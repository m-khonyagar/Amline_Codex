import datetime as dt

from core.base.base_entity import BaseEntity


class RefreshToken(BaseEntity):
    id: int
    token: str
    user_id: int
    expires_at: dt.datetime
    is_revoked: bool
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(self, token: str, user_id: int, expires_at: dt.datetime, is_revoked: bool = False):
        self.id = self.next_id
        self.token = token
        self.user_id = user_id
        self.expires_at = expires_at
        self.is_revoked = is_revoked

    def revoke(self):
        """Mark the refresh token as revoked."""
        self.is_revoked = True

    @property
    def is_expired(self) -> bool:
        """Check if the refresh token is expired."""
        return dt.datetime.now(tz=dt.timezone.utc) >= self.expires_at

    @property
    def is_valid(self) -> bool:
        """Check if the token is neither revoked nor expired."""
        return not self.is_revoked and not self.is_expired
