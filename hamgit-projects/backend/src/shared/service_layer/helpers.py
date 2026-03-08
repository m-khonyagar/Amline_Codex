import os

from magic import Magic

from core.exceptions import ValidationException
from core.translates import validation_trans


def get_extension_from_filename(filename: str) -> str:
    """Extract the file extension from the given filename."""
    try:
        _, extension = os.path.splitext(filename)
        return extension.lstrip(".")
    except ValueError:
        raise ValidationException(detail=validation_trans.invalid_file_name, location=["file_name"])


def get_file_mime_type(file_content: bytes) -> str:
    """Determine the MIME type of the given file content."""
    mime = Magic(mime=True)
    mime_type = mime.from_buffer(file_content)
    return mime_type
