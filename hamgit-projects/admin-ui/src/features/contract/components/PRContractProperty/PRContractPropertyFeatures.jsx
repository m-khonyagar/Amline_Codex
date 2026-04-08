import { useState } from 'react'
import { pickWithDefaults } from '@/utils/object'
import {
  Form,
  useForm,
  InputField,
  SelectField,
  CheckboxField,
  InputNumberField,
} from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import {
  PropertyCoolingSystemTypeOptions,
  PropertyFacilitiesTypeOptions,
  PropertyHeatingSystemTypeOptions,
  PropertyKitchenTypeOptions,
  PropertyRestroomTypeOptions,
  PropertySupplyTypeOptions,
} from '@/data/enums/property-enums'
import { translateEnum } from '@/utils/enum'
import { MinusIcon, PlusIcon } from '@/components/icons'

const PRContractPropertyViewFeatures = ({ property = {} }) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سرویس بهداشتی:</div>
        <div className="mr-auto">
          {property.restroom_type
            ? translateEnum(PropertyRestroomTypeOptions, property.restroom_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سیستم گرمایشی:</div>
        <div className="mr-auto flex flex-wrap gap-2 my-1 justify-end">
          {property.heating_system_types?.length > 0
            ? property.heating_system_types.map((f) => (
                <span key={f} className="border rounded-md px-2 text-sm text-gray-600">
                  {translateEnum(PropertyHeatingSystemTypeOptions, f)}
                </span>
              ))
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سرویس سرمایشی:</div>
        <div className="mr-auto flex flex-wrap gap-2 my-1 justify-end">
          {property.cooling_system_types?.length > 0
            ? property.cooling_system_types.map((f) => (
                <span key={f} className="border rounded-md px-2 text-sm text-gray-600">
                  {translateEnum(PropertyCoolingSystemTypeOptions, f)}
                </span>
              ))
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">آشپزخانه:</div>
        <div className="mr-auto">
          {property.kitchen_type
            ? translateEnum(PropertyKitchenTypeOptions, property.kitchen_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">آب:</div>
        <div className="mr-auto">
          {property.water_supply_type
            ? translateEnum(PropertySupplyTypeOptions, property.water_supply_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">برق:</div>
        <div className="mr-auto">
          {property.electricity_supply_type
            ? translateEnum(PropertySupplyTypeOptions, property.electricity_supply_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">گاز:</div>
        <div className="mr-auto">
          {property.gas_supply_type
            ? translateEnum(PropertySupplyTypeOptions, property.gas_supply_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">فاضلاب:</div>
        <div className="mr-auto">
          {property.sewage_supply_type
            ? translateEnum(PropertySupplyTypeOptions, property.sewage_supply_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">تلفن:</div>
        <div className="mr-auto">
          {property.landline ? (
            <span className="text-primary">دارد</span>
          ) : (
            <span className="text-red-600">ندارد</span>
          )}
        </div>
      </div>

      {property.landline && (
        <>
          <div className="flex items-start gap-2">
            <div className="text-sm text-gray-700 mt-1">شماره تلفن:</div>
            <div className="mr-auto text-left">{property.landline_number.join(' ,') || '-'}</div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">پارکینگ:</div>
        <div className="mr-auto">
          {property.parking ? (
            <span className="text-primary">دارد</span>
          ) : (
            <span className="text-red-600">ندارد</span>
          )}
        </div>
      </div>

      {property.parking && (
        <>
          <div className="flex items-start gap-2">
            <div className="text-sm text-gray-700 mt-1">شماره پارکنیک:</div>
            <div className="mr-auto">{property.parking_number || '-'}</div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">انباری:</div>
        <div className="mr-auto">
          {property.storage_room ? (
            <span className="text-primary">دارد</span>
          ) : (
            <span className="text-red-600">ندارد</span>
          )}
        </div>
      </div>

      {property.storage_room && (
        <>
          <div className="flex items-start gap-2">
            <div className="text-sm text-gray-700 mt-1">شماره انباری:</div>
            <div className="mr-auto">{property.storage_room_number || '-'}</div>
          </div>

          <div className="flex items-start gap-2">
            <div className="text-sm text-gray-700 mt-1">متراژ انباری:</div>
            <div className="mr-auto">
              {property.storage_room_area ? (
                <>
                  {property.storage_room_area}
                  <span className="text-xs mr-1">متر مربع</span>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">آسانسور:</div>
        <div className="mr-auto">
          {property.elevator ? (
            <span className="text-primary">دارد</span>
          ) : (
            <span className="text-red-600">ندارد</span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سایر امکانات:</div>
        <div className="mr-auto flex flex-wrap gap-2 my-1 justify-end">
          {property.other_facilities?.length > 0
            ? property.other_facilities.map((f) => (
                <span key={f} className="border rounded-md px-2 text-sm text-gray-600">
                  {translateEnum(PropertyFacilitiesTypeOptions, f)}
                </span>
              ))
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">توضیحات:</div>
        <div className="mr-auto">{property.description || '-'}</div>
      </div>
    </div>
  )
}

const PRContractPropertyEditFeaturesForm = ({ property = {}, onSubmit, children }) => {
  const [landline, setLandline] = useState({
    value: '',
    error: null,
  })

  const methods = useForm({
    defaultValues: pickWithDefaults(property, {
      restroom_type: '',
      heating_system_types: [],
      cooling_system_types: [],
      kitchen_type: '',
      water_supply_type: '',
      electricity_supply_type: '',
      gas_supply_type: '',
      sewage_supply_type: '',
      number_of_rooms: '',
      parking: false,
      parking_number: '',
      landline: false,
      landline_number: [],
      storage_room: false,
      storage_room_number: '',
      storage_room_area: '',
      other_facilities: [],
      description: '',
      elevator: false,
    }),
  })

  const numbers = methods.watch('landline_number')

  const handleSubmit = (data, methods) => {
    onSubmit(
      {
        ...data,
        storage_room_number: data.storage_room ? Number(data.storage_room_number) : undefined,
        storage_room_area: data.storage_room ? Number(data.storage_room_area) : undefined,
        parking_number: data.parking ? Number(data.parking_number) : undefined,
        landline_number: data.landline ? data.landline_number : undefined,
        number_of_rooms: data.number_of_rooms ? Number(data.number_of_rooms) : undefined,
      },
      methods
    )
  }

  const addNumber = (value) => {
    const current = methods.getValues('landline_number')
    methods.setValue('landline_number', [...current, value])
  }

  const removeNumber = (index) => {
    const current = methods.getValues('landline_number')
    const updated = current.filter((_, i) => i !== index)
    methods.setValue('landline_number', updated)
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <SelectField
        asValue
        label="سرویس بهداشتی"
        name="restroom_type"
        options={PropertyRestroomTypeOptions}
      />

      <SelectField
        asValue
        multiSelect
        label="سیستم گرمایشی"
        name="heating_system_types"
        options={PropertyHeatingSystemTypeOptions}
      />

      <SelectField
        asValue
        multiSelect
        label="سرویس سرمایشی"
        name="cooling_system_types"
        options={PropertyCoolingSystemTypeOptions}
      />

      <SelectField
        asValue
        label="آشپزخانه"
        name="kitchen_type"
        options={PropertyKitchenTypeOptions}
      />

      <SelectField
        asValue
        label="آب"
        name="water_supply_type"
        options={PropertySupplyTypeOptions}
      />

      <SelectField
        asValue
        label="برق"
        name="electricity_supply_type"
        options={PropertySupplyTypeOptions}
      />

      <SelectField asValue label="گاز" name="gas_supply_type" options={PropertySupplyTypeOptions} />

      <SelectField
        asValue
        label="فاضلاب"
        name="sewage_supply_type"
        options={PropertySupplyTypeOptions}
      />

      <InputField type="tel" isNumeric placeholder="3" label="تعداد اتاق" name="number_of_rooms" />

      <div className="flex flex-col gap-4">
        <div>
          <CheckboxField label="پارکینگ" name="parking" />

          {methods.watch('parking') && (
            <InputField
              required
              isNumeric
              className="mt-2"
              placeholder="شماره پارکینگ"
              name="parking_number"
            />
          )}
        </div>

        <div>
          <CheckboxField label="تلفن" name="landline" />

          {methods.watch('landline') && (
            <>
              <div className="flex items-start gap-3.5 mt-2">
                <Input
                  ltr
                  isNumeric
                  type="tel"
                  className="flex-grow"
                  placeholder="شماره تلفن"
                  value={landline.value}
                  error={landline.error}
                  onChange={({ target: { value } }) =>
                    setLandline(() => ({
                      value,
                      error: null,
                    }))
                  }
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="size-[48px] flex shrink-0 border-2"
                  onClick={() => {
                    if (!landline.value) {
                      setLandline((prev) => ({
                        ...prev,
                        error: 'شماره تلفن نمی‌تواند خالی باشد',
                      }))
                      return
                    }

                    if (methods.watch('landline_number').includes(landline.value)) {
                      setLandline((prev) => ({
                        ...prev,
                        error: 'شماره تلفن تکراری است',
                      }))
                      return
                    }

                    setLandline({ value: '', error: null })
                    addNumber(landline.value)
                  }}
                >
                  <PlusIcon />
                </Button>
              </div>

              <div className="flex flex-col">
                {numbers.map((number, index) => (
                  <div key={number} className="flex items-start gap-3.5">
                    <Input readOnly isNumeric type="tel" value={number} className="flex-grow" />

                    <Button
                      variant="outline"
                      size="icon"
                      className="size-[48px] flex shrink-0 border-2 border-red-600"
                      onClick={() => removeNumber(index)}
                    >
                      <MinusIcon size={30} className="text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <CheckboxField label="انباری" name="storage_room" />

          {methods.watch('storage_room') && (
            <div className="flex gap-4">
              <InputField
                required
                isNumeric
                className="w-1/2"
                placeholder="شماره انباری"
                name="storage_room_number"
              />

              <InputNumberField
                required
                // isNumeric
                decimalScale={2}
                suffix="متر مربع"
                className="w-1/2"
                placeholder="متراژ انباری"
                decimalSeparator="/"
                name="storage_room_area"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <CheckboxField label="آسانسور" name="elevator" />
        </div>
      </div>

      <SelectField
        asValue
        multiSelect
        label="سایر امکانات"
        name="other_facilities"
        options={PropertyFacilitiesTypeOptions}
      />

      <InputField
        multiline
        label="توضیحات"
        name="description"
        placeholder="تمامی وسایل روشنایی خونه لوکس و اصل فرانسه‌ و عمرشون با ضمانت 100 ساله‌س "
      />

      {children}
    </Form>
  )
}

export { PRContractPropertyViewFeatures, PRContractPropertyEditFeaturesForm }
