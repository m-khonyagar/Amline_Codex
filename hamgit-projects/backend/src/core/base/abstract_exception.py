class AbstractException(Exception):
    """
    Abstract Exception class.
    This class should be inherited by all custom exceptions.
    """

    def __init__(self, detail: str, location: list[str] = list(), context: dict = dict()) -> None:
        super().__init__(detail)
        self.detail = detail
        self.location = location
        self.context = context
