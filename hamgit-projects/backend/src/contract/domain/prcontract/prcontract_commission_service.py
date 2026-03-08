from dataclasses import dataclass

from financial.domain.enums import ProvinceType


@dataclass
class PRContractCommissionService:
    amline_user_id: int
    shipping_cost: int = 0
    tracking_code_generation_cost: int = 50_000  # 50,000 Toman

    rent_commission_percentage = 0.3  # 30% of the rent value
    rent_commission_percentage_under_100 = 0.4  # 40% of the rent value

    sale_commission_percentage = 0.005  # 0.5% of the sale value
    sale_commission_percentage_under_10m = 0.01  # 1% of the sale value

    sale_commission_percentage_tehran = 0.005  # 0.5% of the sale value
    sale_commission_percentage_tehran_under_10m = 0.01  # 1% of the sale value

    deposit_commission_percentage = 0.006  # 0.6% of the deposit amount
    tax_percentage = 0.1  # 10% of the total amount

    # Round down to the nearest 1000 Toman
    def round_down(self, amount: float) -> int:
        return int(amount * 0.001) * 1000

    def calculate_sale_commission(self, sale_amount: int, province_type: ProvinceType):
        if province_type == ProvinceType.OTHERS:
            if sale_amount <= 10000000:
                sale_commission_amount = sale_amount * self.sale_commission_percentage_under_10m
            else:
                sale_commission_amount = (sale_amount * self.sale_commission_percentage) + 50000
        else:
            if sale_amount <= 10000000:
                sale_commission_amount = sale_amount * self.sale_commission_percentage_tehran_under_10m
            else:
                sale_commission_amount = (sale_amount * self.sale_commission_percentage_tehran) + 50000
        return self.round_down(sale_commission_amount / 2)

    def _calculate_rent_commission(self, rent_amount: int):
        if rent_amount <= 100000:
            rent_commission_amount = rent_amount * self.rent_commission_percentage_under_100
        else:
            rent_commission_amount = (rent_amount * self.rent_commission_percentage) + 10000
        return rent_commission_amount

    def calculate_commission(self, rent_amount: int, deposit_amount: int) -> int:
        rent_commission_amount = self._calculate_rent_commission(rent_amount)
        deposit_commission_amount = deposit_amount * self.deposit_commission_percentage
        return self.round_down((rent_commission_amount + deposit_commission_amount) / 2)

    def calculate_tax(self, total_amount: int) -> int:
        return self.round_down(total_amount * self.tax_percentage)
