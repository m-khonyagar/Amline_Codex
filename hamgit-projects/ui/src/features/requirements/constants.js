import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'

import homeBuyImg from '@/assets/images/requirements/home_buy.svg'
import homeRentalImg from '@/assets/images/requirements/home_rental.svg'
import homeBarterImg from '@/assets/images/requirements/home_barter.svg'
import homeBuyActiveImg from '@/assets/images/requirements/home_buy_active.svg'
import homeRentalActiveImg from '@/assets/images/requirements/home_rental_active.svg'
import homeBarterActiveImg from '@/assets/images/requirements/home_barter_active.svg'

const requirementTypeOptions = [
  {
    value: RequirementTypeEnums.BUY,
    icon: homeBuyImg.src,
    iconActive: homeBuyActiveImg.src,
    path: '/buy',
    label: 'خرید',
  },
  {
    value: RequirementTypeEnums.RENTAL,
    icon: homeRentalImg.src,
    iconActive: homeRentalActiveImg.src,
    path: '/rental',
    label: 'رهن و اجاره',
  },
  {
    value: RequirementTypeEnums.SWAP,
    icon: homeBarterImg.src,
    iconActive: homeBarterActiveImg.src,
    path: '/swap',
    label: 'معاوضه',
  },
]

export { requirementTypeOptions }
