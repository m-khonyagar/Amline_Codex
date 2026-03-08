import abc

from sqlalchemy import text
from sqlalchemy.orm import Session

from account.adapters import repositories as account_repos
from advertisement.adapters import repositories as ad_repos
from contract.adapters import repositories as contract_repos
from core.base.abstract_unit_of_work import AbstractUnitOfWork
from crm.adapters import repositories as crm_repos
from financial.adapters import repositories as financial_repos
from shared.adapters import repositories as shared_repos
from shared.service_layer.services.storage_service import StorageService


class UnitOfWork(AbstractUnitOfWork, abc.ABC):
    # Account
    users: account_repos.UserRepository
    user_saved_ads: account_repos.SavedAdsRepository
    refresh_tokens: account_repos.RefreshTokenRepository
    bank_accounts: account_repos.BankAccountRepository
    user_calls: account_repos.UserCallRepository
    user_texts: account_repos.UserTextRepository

    # Advertisement
    property_wanted_ads: ad_repos.PropertyWantedAdRepository
    property_ads: ad_repos.PropertyAdRepository
    swap_ads: ad_repos.SwapAdRepository
    visit_requests: ad_repos.VisitRequestRepository

    # Contract
    contracts: contract_repos.ContractRepository
    contract_parties: contract_repos.ContractPartyRepository
    contract_steps: contract_repos.ContractStepRepository
    prcontracts: contract_repos.PRContractRepository
    base_contract_clauses: contract_repos.BaseContractClausesRepository
    contract_clauses: contract_repos.ContractClauseRepository
    contract_payments: contract_repos.ContractPaymentRepository
    cheques: contract_repos.ChequeRepository
    contract_descriptions: contract_repos.ContractDescriptionRepository

    # Financial
    transactions: financial_repos.TransactionRepository
    discounts: financial_repos.DiscountRepository
    invoices: financial_repos.InvoiceRepository
    invoice_items: financial_repos.InvoiceItemRepository
    wallets: financial_repos.WalletRepository
    wallet_transactions: financial_repos.WalletTransactionRepository
    settlements: financial_repos.SettlementRepository

    # Shared
    files: shared_repos.FileRepository
    cities: shared_repos.CityRepository
    provinces: shared_repos.ProvinceRepository
    districts: shared_repos.DistrictRepository
    properties: shared_repos.PropertyRepository
    entity_change_logs: shared_repos.EntityChangeLogRepository

    # CRM
    landlord_files: crm_repos.LandlordFileRepository
    tenant_files: crm_repos.TenantFileRepository
    realtor_files: crm_repos.RealtorFileRepository
    file_sources: crm_repos.FileSourceRepository
    file_statuses: crm_repos.FileStatusRepository
    file_calls: crm_repos.FileCallRepository
    file_connections: crm_repos.FileConnectionRepository
    file_texts: crm_repos.FileTextRepository
    realtor_shared_files: crm_repos.RealtorSharedFileRepository
    file_labels: crm_repos.FileLabelRepository
    tasks: crm_repos.TaskRepository
    task_reports: crm_repos.TaskReportRepository


class SQLAlchemyUnitOfWork(UnitOfWork):
    _session: Session
    storage: StorageService | None

    @property
    def session(self) -> Session:
        return self._session

    def __init__(self, session: Session, storage: StorageService | None = None):
        self._session = session
        self.storage = storage

    def __enter__(self) -> AbstractUnitOfWork:

        # Account
        self.users = account_repos.SQLAlchemyUserRepository(self.session)
        self.user_saved_ads = account_repos.SQLAlchemySavedAdsRepository(self.session)
        self.refresh_tokens = account_repos.SQLAlchemyRefreshTokenRepository(self.session)
        self.bank_accounts = account_repos.SQLAlchemyBankAccountRepository(self.session)
        self.user_calls = account_repos.SQLAlchemyUserCallRepository(self.session)
        self.user_texts = account_repos.SQLAlchemyUserTextRepository(self.session)

        # Advertisement
        self.property_wanted_ads = ad_repos.SQLAlchemyPropertyWantedAdRepository(self.session)
        self.property_ads = ad_repos.SQLAlchemyPropertyAdRepository(self.session)
        self.swap_ads = ad_repos.SQLALchemySwapAdRepository(self.session)
        self.visit_requests = ad_repos.SQLALchemyVisitRequestRepository(self.session)

        # Contract
        self.contracts = contract_repos.SQLAlchemyContractRepository(self.session)
        self.prcontracts = contract_repos.SQLAlchemyPRContractRepository(self.session)
        self.contract_parties = contract_repos.SQLAlchemyContractPartyRepository(self.session)
        self.contract_steps = contract_repos.SQLAlchemyContractStepRepository(self.session)
        self.contract_clauses = contract_repos.SQLAlchemyContractClauseRepository(self.session)
        self.base_contract_clauses = contract_repos.SQLAlchemyBaseContractClausesRepository(self.session)
        self.contract_payments = contract_repos.SQLAlchemyContractPaymentRepository(self.session)
        self.cheques = contract_repos.SQLAlchemyChequeRepository(self.session)
        self.contract_descriptions = contract_repos.SQLAlchemyContractDescriptionRepository(self.session)

        # Financial
        self.transactions = financial_repos.SQLAlchemyTransactionRepository(self.session)
        self.discounts = financial_repos.SQLAlchemyDiscountRepository(self.session)
        self.invoices = financial_repos.SQLALchemyInvoiceRepository(self.session)
        self.invoice_items = financial_repos.SQLALchemyInvoiceItemRepository(self.session)
        self.wallets = financial_repos.SQLAlchemyWalletRepository(self.session)
        self.wallet_transactions = financial_repos.SQLAlchemyWalletTransactionRepository(self.session)
        self.settlements = financial_repos.SQLALchemySettlementRepository(self.session)

        # Shared
        self.files = shared_repos.SQLAlchemyFileRepository(session=self.session, storage=self.storage)
        self.cities = shared_repos.SQLAlchemyCityRepository(self.session)
        self.provinces = shared_repos.SQLAlchemyProvinceRepository(self.session)
        self.districts = shared_repos.SQLAlchemyDistrictRepository(self.session)
        self.properties = shared_repos.SQLAlchemyPropertyRepository(self.session)
        self.entity_change_logs = shared_repos.SQLAlchemyEntityChangeLogRepository(self.session)

        # CRM
        self.landlord_files = crm_repos.SQLAlchemyLandlordFileRepository(self.session)
        self.tenant_files = crm_repos.SQLAlchemyTenantFileRepository(self.session)
        self.realtor_files = crm_repos.SQLAlchemyRealtorFileRepository(self.session)
        self.file_sources = crm_repos.SQLAlchemyFileSourceRepository(self.session)
        self.file_statuses = crm_repos.SQLAlchemyFileStatusRepository(self.session)
        self.file_calls = crm_repos.SQLAlchemyFileCallRepository(self.session)
        self.file_connections = crm_repos.SQLAlchemyFileConnectionRepository(self.session)
        self.file_texts = crm_repos.SQLAlchemyFileTextRepository(self.session)
        self.realtor_shared_files = crm_repos.SQLAlchemyRealtorSharedFileRepository(self.session)
        self.file_labels = crm_repos.SQLAlchemyFileLabelRepository(self.session)
        self.tasks = crm_repos.SQLAlchemyTaskRepository(self.session)
        self.task_reports = crm_repos.SQLAlchemyTaskReportRepository(self.session)

        return super().__enter__()

    def _commit(self):
        self.session.commit()

    def _flush(self):
        self.session.flush()

    def rollback(self):
        self.session.rollback()

    def close(self):
        self.session.close()

    def execute(self, query_string: str, **kwargs) -> None:
        self.session.execute(text(query_string), kwargs)
        self.session.commit()

    def fetchone(self, query_string: str, **kwargs) -> dict | None:
        result = self.session.execute(text(query_string), kwargs).fetchone()
        if result is None:
            return None
        return result._asdict()

    def fetchall(self, query_string: str, **kwargs) -> list[dict]:
        result = self.session.execute(text(query_string), kwargs).fetchall()
        return [row._asdict() for row in result]
