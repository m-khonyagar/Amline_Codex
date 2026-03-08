import abc
from io import BytesIO

from minio import Minio
from minio import error as MinioError

from core.exceptions import NotFoundException
from core.logger import Logger
from core.translates import not_found_trans, validation_trans
from core.types import MinioConfig
from shared.service_layer import exceptions

logger = Logger("s3-service")


class S3Service(abc.ABC):

    @abc.abstractmethod
    def upload(self, file: bytes, bucket: str, object_name: str) -> str:
        raise NotImplementedError

    @abc.abstractmethod
    def download(self, bucket: str, object_name: str) -> bytes:
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, bucket: str, object_name: str) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_url(self, bucket: str, object_name: str) -> str:
        raise NotImplementedError


class MinioS3Service(S3Service):
    _client: Minio | None

    def __init__(self, config: MinioConfig):
        self.config = config
        self._client = None

    @property
    def client(self) -> Minio:
        if self._client is None:
            try:
                return Minio(
                    endpoint=self.config.endpoint,
                    access_key=self.config.access_key,
                    secret_key=self.config.secret_key,
                )
            except MinioError.S3Error as error:
                logger.error(f"Error connecting to Minio: {error}")
                raise exceptions.S3ConnectionError("s3_client_connection_error")
        return self._client

    def upload(self, file: bytes, bucket: str, object_name: str) -> str:
        try:
            result = self.client.put_object(
                data=BytesIO(file),
                bucket_name=bucket,
                object_name=object_name,
                length=len(file),
            )
            return self.get_url(bucket, result.object_name)
        except MinioError.ServerError as error:
            logger.error(f"Server Error: {error}")
            raise exceptions.S3FileUploadException("server_error")

    def download(self, bucket: str, object_name: str) -> bytes:
        try:
            response = self.client.get_object(bucket_name=bucket, object_name=object_name)
        except Exception as e:
            logger.error(f"Server Error: {e}")
            raise NotFoundException(not_found_trans.File)

        return response.data

    def delete(self, bucket: str, object_name: str) -> None:
        try:
            self.client.remove_object(bucket_name=bucket, object_name=object_name)
        except Exception as error:
            logger.error(f"Error deleting file: {error}")
            raise exceptions.S3FileDownloadException("file_delete_error")

    def get_url(self, bucket: str, object_name: str) -> str:
        return self.client.presigned_get_object(
            bucket_name=bucket,
            object_name=object_name,
        )

    def _ensure_bucket_exists(self, bucket: str) -> None:
        print(self.config)
        try:
            bucket_exist = self.client.bucket_exists(bucket_name=bucket)
        except MinioError.S3Error as error:
            logger.error(f"Error checking bucket existence: {error}")
            raise exceptions.InvalidBucketNameException(
                detail=validation_trans.invalid_bucket_name, context={"bucket": bucket}
            )
        if bucket_exist:
            return
        logger.info(f"Bucket {bucket} does not exist. Creating...")
        self.client.make_bucket(bucket)
