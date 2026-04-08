from dataclasses import dataclass

from contract.domain.enums import ContractColor, ContractStatus


@dataclass
class PRContractQueryParams:
    search: str | None = None
    mobile: str | None = None
    contract_id: int | None = None
    status: ContractStatus | None = None
    contract_admin: bool = False
    color: ContractColor | None = None

    @property
    def search_phrase(self) -> str | None:
        if self.search:
            return f"%{self.search}%"
        return None

    def dumps(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}
