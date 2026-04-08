from account.domain.entities.user import User
from account.service_layer.dtos import UpdateNicknameDto
from unit_of_work import UnitOfWork


def update_nickname_handler(data: UpdateNicknameDto, user_id: int, uow: UnitOfWork) -> User:
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        user.update(nick_name=data.nick_name)
        uow.commit()
        uow.users.refresh(user)
        if user.avatar_file_id:
            user.avatar_file = uow.files.get_or_raise(id=user.avatar_file_id).dumps()
        return user
