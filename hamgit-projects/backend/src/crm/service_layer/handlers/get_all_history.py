from crm.service_layer.handlers.get_file_call_by_file_id import (
    get_file_calls_by_file_id,
)
from crm.service_layer.handlers.get_file_history import get_file_history_handler
from crm.service_layer.handlers.get_file_text_by_file_id import (
    get_file_texts_by_file_id,
)
from unit_of_work import UnitOfWork


def get_all_history_handler(file_id: int, uow: UnitOfWork):
    all_history = []
    file_history = get_file_history_handler(file_id, uow)
    all_history.extend([dict(**i, type="history") for i in file_history])
    text_history = get_file_texts_by_file_id(file_id, uow)
    all_history.extend([dict(**i, type="text") for i in text_history])
    call_history = get_file_calls_by_file_id(file_id, uow)
    all_history.extend([dict(**i, type="call") for i in call_history])

    sorted_history = sorted(all_history, key=lambda x: x.get("created_at"), reverse=True)  # type: ignore
    return sorted_history
