import ast
from typing import Any, Literal, Type

from sqlalchemy import desc

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.file_label import FileLabel
from crm.domain.entities.file_source import FileSource
from shared.domain.entities.city import City
from shared.domain.entities.district import District
from shared.domain.entities.entity_change_log import EntityChangeLog
from unit_of_work import UnitOfWork

OBJECT_FIELDS = {
    "file_source_id": FileSource,
    "assigned_to": User,
    "city_id": City,
    "district_id": District,
}

OBJECT_FIELDS_LIST = {
    "district_ids": District,
    "label_ids": FileLabel,
}


def to_int(value: Any) -> int:
    try:
        return int(value)
    except ValueError:
        return 0


def to_list(value: Any):
    try:
        list_value = ast.literal_eval(value)
        if isinstance(list_value, list):
            return list_value
    except Exception:
        pass
    return value


def id_parser(uow: UnitOfWork, file_history: EntityChangeLog):
    try:
        ObjectClass: Type[BaseEntity] | None = OBJECT_FIELDS.get(file_history.entity_field, None)
        ObjectClassList: Type[BaseEntity] | None = OBJECT_FIELDS_LIST.get(file_history.entity_field, None)

        if ObjectClass:
            new_obj_id = to_int(file_history.new_value)
            old_obj_id = to_int(file_history.old_value)
            new_obj = uow.session.query(ObjectClass).filter(ObjectClass.id == new_obj_id).one_or_none()
            old_obj = uow.session.query(ObjectClass).filter(ObjectClass.id == old_obj_id).one_or_none()
            new_value = new_obj.__repr__() if isinstance(new_obj.__repr__(), str) else "unknown"
            old_value = old_obj.__repr__() if isinstance(old_obj.__repr__(), str) else "unknown"
            return dict(new_value=new_value, old_value=old_value)

        if ObjectClassList:
            new_obj_list = ast.literal_eval(file_history.new_value) if file_history.new_value != "None" else []
            old_obj_list = ast.literal_eval(file_history.old_value) if file_history.old_value != "None" else []
            new_obj = uow.session.query(ObjectClassList).filter(ObjectClassList.id.in_(new_obj_list)).all()
            old_obj = uow.session.query(ObjectClassList).filter(ObjectClassList.id.in_(old_obj_list)).all()
            new_value = [obj.__repr__() for obj in new_obj] if isinstance(new_obj.__repr__(), str) else "unknown"
            old_value = [obj.__repr__() for obj in old_obj] if isinstance(old_obj.__repr__(), str) else "unknown"
            return dict(new_value=new_value, old_value=old_value)

    except Exception as e:
        print(e)

    return dict(new_value=to_list(file_history.new_value), old_value=to_list(file_history.old_value))


def get_file_history_handler(
    file_id: int,
    uow: UnitOfWork,
    fields: list[str] | None = None,
    filter_type: Literal["exclude", "include"] | None = None,
):
    with uow:
        file_history: list[tuple[EntityChangeLog, User]] = (
            uow.session.query(EntityChangeLog, User)
            .join(User, EntityChangeLog.user_id == User.id)
            .filter(EntityChangeLog.entity_id == file_id)
            .order_by(desc(EntityChangeLog.created_at))  # type: ignore
            .all()
        )
        result = (
            [dict(**file.dumps(**id_parser(uow, file)), user=user.short_dumps()) for file, user in file_history]
            if file_history
            else []
        )

        if fields and filter_type == "exclude":
            fixed_result = [i for i in result if i["entity_field"] not in fields]
        elif fields and filter_type == "include":
            fixed_result = [i for i in result if i["entity_field"] in fields]
        else:
            fixed_result = result

        return fixed_result
