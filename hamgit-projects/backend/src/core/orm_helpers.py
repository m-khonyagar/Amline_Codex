from sqlalchemy import inspect
from sqlalchemy.orm.state import InstanceState

from account.domain.entities.user import User
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import SQLAlchemyUnitOfWork


def save_entity_change_log(uow: SQLAlchemyUnitOfWork, current_user: User) -> None:
    for instance in uow.session.dirty:
        state: InstanceState = inspect(instance)
        for attr in state.attrs:
            if attr.history.has_changes():
                log = EntityChangeLog(
                    user_id=current_user.id,
                    entity_type=instance.__class__.__name__,
                    entity_id=instance.id,
                    entity_field=attr.key,
                    old_value=str(attr.history.deleted[0]) if attr.history.deleted else "None",
                    new_value=str(attr.history.added[0]) if attr.history.added else "None",
                )
                uow.entity_change_logs.add(log)
