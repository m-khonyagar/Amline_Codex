from account.domain.enums import UserRole

ALLOWED_ASSIGNS = {
    UserRole.SUPERUSER: {role for role in UserRole},
    UserRole.STAFF: {UserRole.CONTRACT_ADMIN, UserRole.PERSON},
}
