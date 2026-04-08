from dataclasses import dataclass
from typing import List

from pdf_generator.contracts import entities


@dataclass
class PRContractRequestModel:
    contract: entities.PRContract
