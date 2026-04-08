import { useEffect, useMemo } from 'react'
import { SelectCityField, useGetDistrict } from '@/features/common'
import { ChevronDownIcon } from '@/components/icons'
import RoomSelection from './RoomSelection'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import {
  CheckboxField,
  DatePickerField,
  Form,
  InputField,
  InputNumberField,
  SelectField,
} from '@/components/ui/Form'

export default function WantedForm({ onDone, onPreview, methods, isRental }) {
  const selectedPropertyType = methods.watch('property_type')

  function getCategory(value) {
    return value && value.length ? value.split('_')[0] : ''
  }

  const propertyTypes = useMemo(() => {
    const selectedPropertyTypeOptions = propertyTypesOptions.filter((i) =>
      selectedPropertyType.includes(i.value)
    )

    return propertyTypesOptions.map((type) => {
      return {
        ...type,
        disabled: !!selectedPropertyTypeOptions.find(
          (i) => getCategory(i.value) !== getCategory(type.value)
        ),
      }
    })
  }, [selectedPropertyType])

  const selectedCity = methods.watch('city_id')

  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })

  useEffect(() => {
    const newCitySelected = methods
      .getValues('districts_list')
      .find((district) => district.city_id && district.city_id !== selectedCity)

    if (newCitySelected) {
      methods.setValue('districts_list', [])
    }
  }, [methods, selectedCity])

  return (
    <div className="px-6 mt-6 flex flex-col gap-4">
      <Form methods={methods} onSubmit={onDone} className="flex flex-col gap-2">
        <InputField required label="عنوان" name="title" />

        <SelectField
          multiSelect
          label={`چه ملکی برای ${isRental ? 'اجاره' : 'خرید'} نیاز داری؟`}
          name="property_type"
          asValue
          required
          searchable
          options={propertyTypes}
        />

        <SelectCityField required asValue name="city_id" label="شهر" />

        <SelectField
          searchable
          multiSelect
          valueKey="id"
          label="محله"
          labelKey="name"
          name="districts_list"
          disabled={!selectedCity}
          options={districtOptionQuery.data}
          loading={districtOptionQuery.isLoading}
        />

        <InputNumberField
          required
          pattern={{
            value: /^(?!0$)\d+$/,
            message: 'حداقل متراژ را نمیتوان 0 وارد کرد',
          }}
          suffix="متر"
          placeholder="50"
          decimalScale={2}
          decimalSeparator="/"
          label="حداقل متراژ"
          name="min_size"
        />

        {isRental ? (
          <>
            <InputNumberField
              required
              suffix="تومان"
              decimalScale={2}
              placeholder="2,000,000"
              decimalSeparator="/"
              label="حداکثر رهن"
              name="max_deposit"
            />

            <InputNumberField
              required
              decimalScale={2}
              suffix="تومان"
              placeholder="2,000,000"
              decimalSeparator="/"
              label="حداکثر اجاره"
              name="max_rent"
            />
          </>
        ) : (
          <>
            <DatePickerField
              format="yyyy"
              label="سال ساخت"
              valueFormat="yyyy-MM-dd"
              dayPicker={false}
              monthPicker={false}
              placeholder="انتخاب کنید"
              suffixIcon={<ChevronDownIcon />}
              name="construction_year"
            />

            <InputNumberField
              required
              decimalScale={2}
              suffix="تومان"
              placeholder="2,000,000"
              decimalSeparator="/"
              label="قیمت کل"
              name="sale_price"
              className="mt-4"
            />
          </>
        )}

        {isRental && (
          <DatePickerField
            format="yyyy/MM/dd"
            label="حداکثر مهلت شما برای اجاره/رهن (اختیاری)"
            valueFormat="yyyy-MM-dd"
            placeholder="انتخاب کنید"
            suffixIcon={<ChevronDownIcon />}
            name="tenant_deadline"
          />
        )}

        <div className="flex flex-col gap-2">
          <span>تعداد اتاق</span>
          <RoomSelection
            maxRooms={4}
            value={methods.getValues('room_count')}
            onChange={(rooms) => methods.setValue('room_count', rooms)}
            require
          />
        </div>

        <div className="flex flex-col gap-3 mt-6 mb-3">
          <span>امکانات ساختمان</span>
          <div className="flex justify-start gap-4">
            <CheckboxField label="آسانسور" name="elevator" />
            <CheckboxField label="انباری" name="storage_room" />
            <CheckboxField label="پارکینگ" name="parking" />
          </div>
        </div>

        <InputField multiline label="توضیحات (اختیاری)" name="description" />

        <BottomCTA>
          <div className="flex gap-4">
            <Button type="button" className="w-full" variant="outline" onClick={onPreview}>
              پیش نمایش
            </Button>

            <Button className="w-full" type="submit">
              انتشار نیازمندی
            </Button>
          </div>
        </BottomCTA>
      </Form>
    </div>
  )
}
