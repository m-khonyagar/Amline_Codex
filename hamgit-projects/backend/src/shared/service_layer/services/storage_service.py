from abc import ABC, abstractmethod
from datetime import timedelta
from io import BytesIO

from minio import Minio

from core.logger import Logger
from core.types import MinioConfig
from shared.domain.entities.file import File
from shared.domain.enums import FileAccess
from shared.service_layer.exceptions import (
    FileIsNotPublicException,
    StorageServiceConnectionException,
)

logger = Logger("storage-service")


class StorageService(ABC):
    def upload(self, file: File, file_bytes: bytes) -> str | None:
        try:
            self._upload(file, file_bytes)
        except Exception as exc:
            logger.error("Error uploading file", exc)
            raise StorageServiceConnectionException

        try:
            return self.get_url(file)
        except FileIsNotPublicException:
            return None

    @abstractmethod
    def _upload(self, file: File, file_bytes: bytes) -> None:
        raise NotImplementedError

    def download(self, file: File) -> bytes:
        return self._download(file)

    @abstractmethod
    def _download(self, file: File) -> bytes:
        try:
            return self._download(file)
        except Exception as exc:
            logger.error("Error downloading file", exc)
            raise exc

    def delete(self, file: File) -> None:
        try:
            self._delete(file)
        except Exception as exc:
            logger.error("Error deleting file", exc)
            raise exc

    @abstractmethod
    def _delete(self, file: File) -> None:
        raise NotImplementedError

    def get_url(self, file: File) -> str:
        if file.access == FileAccess.PRIVATE:
            raise FileIsNotPublicException
        return self._get_url(file)

    @abstractmethod
    def _get_url(self, file: File) -> str:
        raise NotImplementedError


class MinioStorage(StorageService):

    _client: Minio | None

    def __init__(self, config: MinioConfig) -> None:
        self.endpoint = config.endpoint
        self.access_key = config.access_key
        self.secret_key = config.secret_key
        self.private_bucket = config.private_bucket
        self.public_bucket = config.public_bucket
        self.url_expire_minutes = config.url_expire_minutes
        self._client = None

    @property
    def client(self) -> Minio:
        """Return a Minio client instance."""
        if self._client is None:
            return Minio(endpoint=self.endpoint, access_key=self.access_key, secret_key=self.secret_key)
        return self._client

    def get_bucket_and_object_name(self, file: File) -> tuple:
        bucket = self.private_bucket if file.access == FileAccess.PRIVATE else self.public_bucket
        object_name = f"{file.type}/{file.name}"
        return bucket, object_name

    def _upload(self, file: File, file_bytes: bytes) -> None:
        bucket, object_name = self.get_bucket_and_object_name(file)
        self.client.put_object(
            bucket_name=bucket,
            object_name=object_name,
            data=BytesIO(file_bytes),
            length=file.size,
        )

    def _download(self, file: File) -> bytes:
        bucket, object_name = self.get_bucket_and_object_name(file)
        response = self.client.get_object(bucket_name=bucket, object_name=object_name)
        return response.data

    def _delete(self, file: File) -> None:
        bucket, object_name = self.get_bucket_and_object_name(file)
        self.client.remove_object(bucket_name=bucket, object_name=object_name)

    def _get_url(self, file: File) -> str:
        bucket, object_name = self.get_bucket_and_object_name(file)
        return self.client.presigned_get_object(
            bucket_name=bucket,
            object_name=object_name,
            expires=timedelta(minutes=self.url_expire_minutes),
        )
