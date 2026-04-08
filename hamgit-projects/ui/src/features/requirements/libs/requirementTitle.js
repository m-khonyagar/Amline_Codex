import { propertyTypesOptions } from '../../contract/libs/property-constants'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'

export const getRequirementTitle = (type, properties) => {
  const propertiesLabel = properties.map(
    (p) => propertyTypesOptions.find((i) => i.value === p).label
  )
  const propertyType = propertiesLabel[0].split('-')[0]
  const isRental = type === RequirementTypeEnums.RENTAL

  return `دنبال${isRental ? ' رهن ' : ' خرید '}${propertyType} هستم`
}
