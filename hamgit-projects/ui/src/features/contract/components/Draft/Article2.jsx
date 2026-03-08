import React from 'react'
import { formatYear } from '@/utils/time'
import CollapseBox from '@/components/ui/CollapseBox'
import { intersperse } from '@/utils/dom'
import {
  propertyTypesOptions,
  propertyFacadeTypeOptions,
  propertyDeedStatusOptions,
  propertyStructureTypeOptions,
  propertyFlooringTypeOptions,
  propertyDirectionTypeOptions,
  propertyRestroomTypeOptions,
  propertyFacilitiesType,
  propertySupplyTypeOptions,
  propertyCoolingSystemTypeOptions,
  propertyHeatingSystemTypeOptions,
  propertyKitchenTypeOptions,
} from '../../libs/property-constants'

const tableKeyClass = 'border border-slate-950 py-1.5'
const tableValueCssClasses = 'border border-slate-950 py-1.5 text-primary'
const findEnumLabel = (enumOptions, value) => {
  const options = enumOptions.find((i) => i.value === value)
  return options?.label || '--'
}
const findArrayEnum = (enumOptions, enumArray) => {
  return enumArray.map((f) => findEnumLabel(enumOptions, f))
}

function Article2({ propertyData }) {
  if (!propertyData) return ''
  const property = propertyData || {}
  const propertyFullAddress = property.city?.name
    ? `استان ${property.city.province}،شهر ${property.city.name} ، ${property.address}`
    : property.address

  const propertyFeatures = findArrayEnum(propertyFacilitiesType, property.other_facilities)
  const flooringType = findArrayEnum(propertyFlooringTypeOptions, property.flooring_types)
  const coolingSystemType = findArrayEnum(
    propertyCoolingSystemTypeOptions,
    property.cooling_system_types
  )
  const heatingSystemType = findArrayEnum(
    propertyHeatingSystemTypeOptions,
    property.heating_system_types
  )
  const facadeType = findArrayEnum(propertyFacadeTypeOptions, property.facade_types)
  const restroomType = findEnumLabel(propertyRestroomTypeOptions, property.restroom_type)
  const propertyType = findEnumLabel(propertyTypesOptions, property.property_type)
  const structureType = findEnumLabel(propertyStructureTypeOptions, property.structure_type)
  const sewageSupplyType = findEnumLabel(propertySupplyTypeOptions, property.sewage_supply_type)
  const deedStatus = findEnumLabel(propertyDeedStatusOptions, property.deed_status)
  const directionType = findEnumLabel(propertyDirectionTypeOptions, property.direction_type)
  const waterSupplyType = findEnumLabel(propertySupplyTypeOptions, property.water_supply_type)
  const gasSupplyType = findEnumLabel(propertySupplyTypeOptions, property.gas_supply_type)
  const kitchenType = findEnumLabel(propertyKitchenTypeOptions, property.kitchen_type)
  const electricitySupplyType = findEnumLabel(
    propertySupplyTypeOptions,
    property.electricity_supply_type
  )

  return (
    <div className="bg-background rounded-2xl p-4 shadow-xl fa">
      <CollapseBox
        label="ماده 2: موضوع قرارداد و مشخصات مورد اجاره"
        contentClassName="border-t mt-5"
      >
        <div className="my-5">
          <div className="text-center">
            <p className="font-bold mb-5">بند اول: موضوع قرارداد </p>
            <p className="text-sm text-right">
              <span>اجاره (تملیک منافع) 6 دانگ از 6 دانگ یک</span>
              <span className="inline-block text-primary pr-2">{propertyType}</span>
            </p>
          </div>
          <div className="mt-10 mb-5 w-2/3 border-b mx-auto" />
          <p className="text-center font-bold mb-3">بند دوم: مشخصات مورد اجاره</p>
          <p className="text-sm text-right mb-5">
            <span className="inline text-primary">{propertyType}</span>&nbsp;
            <span className="inline">واقع در</span>&nbsp;
            <span className="inline text-primary">{propertyFullAddress}</span>&nbsp;
            <span className="inline">می‌باشد.</span>
          </p>
          <div className="flex gap-2 text-center mb-6">
            <table className="border-collapse border border-slate-400 w-full text-xs">
              <tbody>
                <tr>
                  <td className={tableKeyClass}>کد پستی</td>
                  <td className={tableValueCssClasses}>{property.postal_code || '--'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>شناسه قبض برق</td>
                  <td className={tableValueCssClasses}>{property.electricity_bill_id || '--'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>پلاک ثبتی فرعی</td>
                  <td className={tableValueCssClasses}>{property.sub_register_number || '--'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>مساحت</td>
                  <td className={tableValueCssClasses}>
                    {property.area ? `${property.area} متر مربع` : '--'}
                  </td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>اسکلت</td>
                  <td className={tableValueCssClasses}>{structureType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>کفپوش</td>
                  <td className={tableValueCssClasses}>{intersperse(flooringType, ' , ')}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>سرویس بهداشتی</td>
                  <td className={tableValueCssClasses}>{restroomType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>سیستم سرمایش</td>
                  <td className={tableValueCssClasses}>{intersperse(coolingSystemType, ' , ')}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>فاضلاب</td>
                  <td className={tableValueCssClasses}>{sewageSupplyType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>برق</td>
                  <td className={tableValueCssClasses}>{electricitySupplyType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>آسانسور</td>
                  <td className={tableValueCssClasses}>{property.elevator ? 'دارد' : 'ندارد'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>شماره انباری</td>
                  <td className={tableValueCssClasses}>{property.storage_room_number || '--'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>شماره پارکینگ</td>
                  <td className={tableValueCssClasses}>{property.parking_number || '--'}</td>
                </tr>
              </tbody>
            </table>
            <table className="border-collapse border border-slate-400 w-full text-xs">
              <tbody>
                <tr>
                  <td className={tableKeyClass}>سال ساخت</td>
                  <td className={tableValueCssClasses}>
                    {property.build_year && formatYear(property.build_year)}
                  </td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>پلاک ثبتی اصلی</td>
                  <td className={tableValueCssClasses}>{property.main_register_number || '--'}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>نوع سند</td>
                  <td className={tableValueCssClasses}>{deedStatus}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>نمای ساختمانی</td>
                  <td className={tableValueCssClasses}>{intersperse(facadeType, ' , ')}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>جهت</td>
                  <td className={tableValueCssClasses}>{directionType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>اتاق خواب</td>
                  <td className={tableValueCssClasses}>{property.number_of_rooms}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>سیستم گرمایش</td>
                  <td className={tableValueCssClasses}>{intersperse(heatingSystemType, ' , ')}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>آب</td>
                  <td className={tableValueCssClasses}>{waterSupplyType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>گاز</td>
                  <td className={tableValueCssClasses}>{gasSupplyType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>آشپزخانه</td>
                  <td className={tableValueCssClasses}>{kitchenType}</td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>متراژ انباری</td>
                  <td className={tableValueCssClasses}>
                    {property.storage_room ? `${property.storage_room_area} متر` : '--'}
                  </td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>شماره تلفن</td>
                  <td className={tableValueCssClasses}>
                    {property?.landline
                      ? property.landline_number.map((number, index) => (
                          <React.Fragment key={number}>
                            {number}
                            {index !== property.landline_number.length - 1 && <br />}
                          </React.Fragment>
                        ))
                      : '--'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {!!propertyFeatures.length && (
            <>
              <p className="mb-2">سایر امکانات:</p>
              <div className="flex gap-1 flex-wrap text-sm mb-10">
                {propertyFeatures.map((feat) => (
                  <div
                    key={feat}
                    className="text-[#1E1E1F] bg-[#D7D9DE] border border-[#676767] rounded py-1 px-2"
                  >
                    {feat}
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="text-sm">
            همچنین تمامی منصوبات و مشاعات مربوطه به رویت مستاجر/مستاجران رسیده است.
          </p>
        </div>
      </CollapseBox>
    </div>
  )
}

export default Article2
