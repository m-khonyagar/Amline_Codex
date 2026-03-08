import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from '@/components/ui/Modal'
import { ChevronRightIcon, CloseIcon, FilterIcon } from '@/components/icons'
import { CheckboxField, Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import { SelectCityField, useGetDistrict } from '@/features/common'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'
import Button from '@/components/ui/Button'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import RoomSelection from './RoomSelection'
import { queryKeyMap } from '../libs/filters'
import { pickWithDefaults } from '@/utils/object'
import useGetCities from '../../common/api/get-cities'
import { removeEmptyFilters } from '../utils/filter'

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
  districts: [],
  elevator: false,
  parking: false,
  storage_room: false,
  property_type: [],
  order_by_cheapest: '',
  min_sale_price: '',
  max_sale_price: '',
}

function RequirementsFilter({ requirementType }) {
  const router = useRouter()
  const { query: filters } = router
  const [showModalFilter, setShowModalFilter] = useState(false)

  const updateFilter = (val) => {
    router.push({ query: { ...val, type: requirementType } })
  }

  const methods = useForm({
    defaultValues: pickWithDefaults(filters, defaultValues),
  })

  const citiesQuery = useGetCities()
  const { data: cities } = citiesQuery
  const selectedCity = methods.watch('city')

  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const { data: district } = districtOptionQuery

  useEffect(() => {
    methods.setValue('districts', [])
  }, [methods, selectedCity])

  const handleSubmit = (_data) => {
    const newFilters = removeEmptyFilters(_data)
    updateFilter(newFilters)
    setShowModalFilter(false)
  }

  const handleSortByCheapest = (val) => {
    const newFilters = { ...filters }

    if (newFilters.order_by_cheapest === val.toString()) delete newFilters.order_by_cheapest
    else newFilters.order_by_cheapest = val

    updateFilter(newFilters)
  }

  const handleRemoveFilter = (keyName) => {
    const query = { ...filters }
    delete query[keyName]
    updateFilter(query)
  }

  const filterMap = {
    city: (val) => cities?.find((i) => i.id === val).name,
    districts: (val) => district?.filter((i) => val.includes(i.id)).map((i) => `${i.name} `),
    elevator: (val) => (val ? 'دارد' : ''),
    parking: (val) => (val ? 'دارد' : ''),
    storage_room: (val) => (val ? 'دارد' : ''),
    property_type: (val) =>
      val.map((type) => propertyTypesOptions.find((i) => i.value === type)?.label).join('، '),
    order_by_cheapest: (val) => (val === 'true' ? 'ارزانترین' : 'گرانترین'),
  }
  const getFilterValuesName = (key, value) => {
    return typeof filterMap[key] === 'function' ? filterMap[key](value) : value
  }

  useEffect(() => {
    if (showModalFilter) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [showModalFilter])

  return (
    <>
      <div className="mb-5">
        <div className="flex justify-between gap-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full relative"
            onClick={() => setShowModalFilter(true)}
          >
            {Object.keys(filters).length - 1 > 0 && (
              <span className="size-[20px] bg-teal-600 text-white rounded-full fa absolute top-0 left-0 -translate-y-1/2">
                {Object.keys(filters).length - 1}
              </span>
            )}
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

        <div className="flex gap-2 overflow-x-scroll no-scrollbar fa mt-2">
          {Object.keys(filters).map(
            (keyName) =>
              keyName !== 'type' && (
                <div
                  className="bg-rust-100 flex items-center gap-2 text-rust-600 rounded-full px-4 flex-wrap min-w-fit"
                  key={keyName}
                >
                  <span>{queryKeyMap[keyName]}</span>:
                  <span>{getFilterValuesName(keyName, filters[keyName])}</span>
                  <CloseIcon size={15} onClick={() => handleRemoveFilter(keyName)} />
                </div>
              )
          )}
        </div>
      </div>

      <Modal
        open={showModalFilter}
        handleClose={() => setShowModalFilter(false)}
        className="!rounded-none w-full max-w-2xl h-screen overflow-y-auto py-0"
      >
        <div>
          <div className="border-b -mx-6 py-2 px-3">
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

          <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col py-5">
            <SelectField
              multiSelect
              asValue
              label="نوع و کاربری ملک"
              options={propertyTypesOptions}
              className="!mb-0"
              prefix={null}
              name="property_type"
              horizontalMode
            />
            <SelectCityField name="city" label="شهر" className="!mb-0" horizontalMode />
            <SelectField
              multiSelect
              asValue
              valueKey="id"
              label="محله"
              labelKey="name"
              name="districts"
              className="!mb-0"
              searchable
              horizontalMode
              disabled={!selectedCity}
              options={districtOptionQuery.data}
              loading={districtOptionQuery.isLoading}
            />
            <div className="mt-4 w-full">
              {requirementType === RequirementTypeEnums.RENTAL ? (
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
              {requirementType === RequirementTypeEnums.RENTAL && (
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

export default RequirementsFilter
