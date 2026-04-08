import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { CheckboxField, Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import { pickWithDefaults } from '@/utils/object'
import useGetCities from '../../common/api/get-cities'
import { SelectCityField, useGetDistrict } from '@/features/common'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import Button from '@/components/ui/Button'
import { ChevronRightIcon, CloseIcon, FilterIcon } from '@/components/icons'
import Modal from '@/components/ui/Modal'
import { removeEmptyFilters } from '../../requirements/utils/filter'
import RoomSelection from '../../requirements/components/RoomSelection'
import { queryKeyMap } from '../../requirements/libs/filters'
import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'

const defaultValues = {
  city: '',
  min_meter: '',
  max_meter: '',
  min_deposit: '',
  max_deposit: '',
  min_rent: '',
  max_rent: '',
  room_count: '',
  min_construction_year: '',
  max_construction_year: '',
  districts: '',
  elevator: false,
  parking: false,
  storage_room: false,
  property_type: '',
  order_by_cheapest: '',
  min_sale_price: '',
  max_sale_price: '',
}

function AdsFilter() {
  const router = useRouter()
  const adType = router.query?.type?.toLocaleUpperCase()
  const filters = useMemo(() => {
    const a = { ...router.query }
    delete a.type
    delete a.cat
    return a
  }, [router.query])

  const [showModalFilter, setShowModalFilter] = useState(false)

  const updateFilter = (val) => {
    router.push({ query: { ...val, type: router.query.type, cat: router.query.cat } })
  }

  const methods = useForm({
    defaultValues: pickWithDefaults(filters, defaultValues),
  })

  const citiesQuery = useGetCities()
  const { data: cities } = citiesQuery
  const selectedCity = methods.watch('city')

  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const { data: district } = districtOptionQuery
  const selectedDistrictOption = useMemo(
    () => (district || []).find((i) => i.id === methods.watch('districts')),
    [district]
  )

  useEffect(() => {
    const newCitySelected = selectedDistrictOption?.city !== selectedCity
    if (newCitySelected) {
      methods.setValue('districts', null)
    }
  }, [methods, selectedCity])

  const handleSubmit = (_data) => {
    const newFilters = removeEmptyFilters(_data)
    updateFilter(newFilters)
    setShowModalFilter(false)
  }
  const handleSortByCheapest = (val) => {
    const newFilters = filters

    newFilters.order_by_cheapest = val
    updateFilter(newFilters)
  }
  const handleRemoveFilter = (keyName) => {
    const query = filters
    delete query[keyName]
    updateFilter(query)
  }

  const filterMap = {
    city: (val) => cities?.find((i) => i.id === val).name,
    districts: (val) => district?.find((i) => i.id === val).name,
    elevator: (val) => (val ? 'دارد' : ''),
    parking: (val) => (val ? 'دارد' : ''),
    storage_room: (val) => (val ? 'دارد' : ''),
    property_type: (val) => propertyTypesOptions.find((i) => i.value === val).label,
    order_by_cheapest: (val) => (val === 'true' ? 'ارزانترین' : 'گرانترین'),
  }
  const getFilterValuesName = (key, value) => {
    return typeof filterMap[key] === 'function' ? filterMap[key](value) : value
  }

  return (
    <>
      <div className="flex justify-between gap-3 mb-3">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => setShowModalFilter(true)}
        >
          <FilterIcon className="ml-2" />
          فیلتر ها
        </Button>
        <Button
          size="sm"
          className="w-full"
          variant={filters.order_by_cheapest === 'true' ? 'default' : 'outline'}
          onClick={() => handleSortByCheapest(true)}
        >
          ارزانترین
        </Button>
        <Button
          size="sm"
          className="w-full"
          variant={filters.order_by_cheapest === 'false' ? 'default' : 'outline'}
          onClick={() => handleSortByCheapest(false)}
        >
          گرانترین
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-scroll no-scrollbar fa">
        {Object.keys(filters).map(
          (keyName, i) =>
            keyName !== 'type' && (
              <div
                className="bg-rust-100 flex items-center gap-2 text-rust-600 rounded-full px-4 flex-wrap min-w-fit"
                key={i}
              >
                <span>{queryKeyMap[keyName]}</span>:
                <span>{getFilterValuesName(keyName, filters[keyName])}</span>
                <CloseIcon size={15} onClick={() => handleRemoveFilter(keyName)} />
              </div>
            )
        )}
      </div>

      <Modal
        open={showModalFilter}
        handleClose={() => setShowModalFilter(false)}
        className="!rounded-none w-full max-w-2xl h-full pt-0"
      >
        <div>
          <div className="border-b -mx-6 py-2 px-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowModalFilter(false)}>
                <ChevronRightIcon />
              </Button>
              فیلتر
              <Button
                variant="ghost"
                size="sm"
                className="mr-auto text-gray-300 text-sm"
                onClick={() => methods.reset()}
              >
                حذف فیلتر ها
              </Button>
            </div>
          </div>
          <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col">
            <SelectCityField name="city" label="شهر" className="w-full" horizontalMode />
            <SelectField
              asValue
              valueKey="id"
              label="محله"
              labelKey="name"
              name="districts"
              searchable
              horizontalMode
              disabled={!selectedCity}
              options={districtOptionQuery.data}
              loading={districtOptionQuery.isLoading}
            />
            <div className="mt-4 w-full">
              {adType === AdPropertyTypeEnums.FOR_RENT ? (
                <div className="flex items-center">
                  <InputField
                    name="min_deposit"
                    label="قیمت ودیعه"
                    placeholder="از"
                    wrapperClassName="!rounded-l-none"
                    className="basis-1/2"
                  />
                  <InputField
                    name="max_deposit"
                    placeholder="تا"
                    className="basis-1/2 mt-[33.7px] outline-none"
                    wrapperClassName="!rounded-r-none !border-r-0"
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <InputField
                    name="min_sale_price"
                    label="قیمت کل"
                    placeholder="از"
                    className="basis-1/2"
                    wrapperClassName="!rounded-l-none"
                  />
                  <InputField
                    name="max_sale_price"
                    placeholder="تا"
                    className="basis-1/2 mt-[33.7px] outline-none"
                    wrapperClassName="!rounded-r-none !border-r-0 outline-0"
                  />
                </div>
              )}
              {adType === AdPropertyTypeEnums.FOR_RENT && (
                <div className="flex items-center">
                  <InputField
                    name="min_rent"
                    label="قیمت اجاره"
                    placeholder="از"
                    className="basis-1/2"
                    wrapperClassName="!rounded-l-none"
                  />
                  <InputField
                    name="max_rent"
                    placeholder="تا"
                    className="basis-1/2 mt-[33.7px] outline-none"
                    wrapperClassName="!rounded-r-none !border-r-0 outline-0"
                  />
                </div>
              )}

              <div className="flex items-center">
                <InputField
                  name="min_construction_year"
                  label="سال ساخت"
                  placeholder="از"
                  className="basis-1/2"
                  wrapperClassName="!rounded-l-none"
                />
                <InputField
                  name="max_construction_year"
                  placeholder="تا"
                  className="basis-1/2 mt-[33.7px] outline-none"
                  wrapperClassName="!rounded-r-none !border-r-0 outline-0"
                />
              </div>
              <div className="flex items-center">
                <InputField
                  name="min_meter"
                  label="متراژ"
                  placeholder="از"
                  className="basis-1/2"
                  wrapperClassName="!rounded-l-none"
                />
                <InputField
                  name="max_meter"
                  placeholder="تا"
                  className="basis-1/2 mt-[33.7px] outline-none"
                  wrapperClassName="!rounded-r-none !border-r-0 outline-0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span>تعداد اتاق</span>
                <RoomSelection
                  value={methods.getValues('room_count')}
                  onChange={(rooms) => methods.setValue('room_count', rooms)}
                  maxRooms={4}
                />
              </div>
              <div className="flex justify-around gap-4 mt-6">
                <CheckboxField label="پارکینگ" name="parking" />
                <CheckboxField label="آسانسور" name="elevator" />
                <CheckboxField label="انباری" name="storage_room" />
              </div>
            </div>
            <Button className="w-full mt-10" type="submit">
              اعمال فیلتر
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default AdsFilter
