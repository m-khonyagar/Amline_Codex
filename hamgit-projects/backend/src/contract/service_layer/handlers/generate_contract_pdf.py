from contract.domain.enums import ContractStatus
from contract.domain.prcontract.prcontract_pdf_generator_service import (
    PDFGeneratingFailed,
    PRContractPDFGeneratorService,
)
from core.exceptions import ProcessingException, ServerException
from core.logger import Logger
from core.translates.processing_exception import ProcessingExcTrans
from shared.domain.entities.file import File
from shared.domain.enums import FileType
from shared.service_layer.exceptions import (
    InvalidBucketNameException,
    S3FileUploadException,
)
from shared.service_layer.services.storage_service import StorageService
from unit_of_work import UnitOfWork

logger = Logger("generate_contract_pdf_handler")


def add_pdf_file_to_contract_handler(contract_id: int, uow: UnitOfWork, file_id: int) -> None:
    with uow:

        contract = uow.contracts.get_or_raise(id=contract_id)
        contract.pdf_file_id = file_id
        contract.status = ContractStatus.PDF_GENERATED

        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        prcontract.pdf_file_id = file_id
        prcontract.status = ContractStatus.PDF_GENERATED
        uow.commit()


def generate_contract_pdf_handler(
    contract_id: int, uow: UnitOfWork, pdf_generator: PRContractPDFGeneratorService, storage: StorageService
) -> File:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)
        if contract.status not in [
            ContractStatus.COMPLETED,
            ContractStatus.PDF_GENERATED,
            ContractStatus.PDF_GENERATING_FAILED,
        ]:
            raise ProcessingException(ProcessingExcTrans.contract_not_ready_for_pdf_generation)

        try:
            pdf = pdf_generator.generate_pdf(contract_id=contract_id)
            pdf_file = File(type=FileType.CONTRACT_PDF, size=len(pdf), mime_type="application/pdf", extension="pdf")
            storage.upload(file=pdf_file, file_bytes=pdf)
            uow.files.add(pdf_file)
            uow.flush()

            contract.pdf_file = pdf_file
            contract.status = ContractStatus.PDF_GENERATED
            prc.update_contract(contract)
            uow.commit()
            uow.files.refresh(pdf_file)
            return pdf_file
        except (S3FileUploadException, InvalidBucketNameException, PDFGeneratingFailed) as exc:
            contract.status = ContractStatus.PDF_GENERATING_FAILED
            prc.update_contract(contract)
            uow.commit()
            raise exc
        except Exception as exc:
            logger.error(f"Failed to generate PDF for contract {contract_id}. Error: {exc}")
            raise ServerException("Something went wrong while generating PDF")
