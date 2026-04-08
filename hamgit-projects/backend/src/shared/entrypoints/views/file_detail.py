from unit_of_work import UnitOfWork


def file_detail_view(file_id: int, uow: UnitOfWork) -> dict:
    with uow:
        file = uow.files.get_or_raise(id=file_id)
        return file.dumps()
