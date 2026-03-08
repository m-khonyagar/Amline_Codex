import { useEffect, useState } from 'react'
import { SelectCityField, useDownloadFile, useGetDistrict, useUploadFile } from '@/features/common'
import { ChevronDownIcon, TomanIcon } from '@/components/icons'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'
import {
  propertyFacilitiesType,
  propertyTypesOptions,
} from '../../contract/libs/property-constants'
import {
  CheckboxField,
  DatePickerField,
  Form,
  InputField,
  InputNumberField,
  LocationPickerField,
  SelectField,
} from '@/components/ui/Form'
import RoomSelection from '../../requirements/components/RoomSelection'
import ImageUploaderField from '@/components/ui/Form/ImageUploaderField'
import { FileTypeEnums } from '@/data/enums/file_type_enums'
import { toast } from '@/components/ui/Toaster'

export default function AdForm({ onDone, methods, isRental, isEditMode, loading, onPreview }) {
  const selectedCity = methods.watch('city_id')

  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })

  useEffect(() => {
    const newCitySelected = methods.getValues('district')?.city_id !== selectedCity
    if (newCitySelected) {
      methods.setValue('district', '')
    }
  }, [methods, selectedCity])

  const [uploadState, setUploadState] = useState()
  const uploadMutation = useUploadFile({
    fileType: FileTypeEnums.PROPERTY_IMAGE,
  })
  const downloadFileMutation = useDownloadFile()
  const handleSubmit = async (data) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    onDone?.(data)
  }
  const handlePreview = async (data) => {
    const isValid = await methods.trigger()
    if (isValid) {
      if (uploadState === 'loading') {
        toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
        return
      }

      if (uploadState === 'error') {
        toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
        return
      }
      onPreview?.(data)
    }
  }

  return (
    <div className="px-6 mt-6 pb-20">
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <SelectField
          label="نوع و کاربری ملک"
          name="property_info.property_type"
          asValue
          required
          searchable
          options={propertyTypesOptions}
        />

        <SelectCityField required asValue name="city_id" label="شهر" />

        <SelectField
          searchable
          valueKey="id"
          label="محله"
          labelKey="name"
          name="district"
          disabled={!selectedCity}
          options={districtOptionQuery.data}
          loading={districtOptionQuery.isLoading}
        />

        <LocationPickerField label="موقعیت ملک" name="location" className="mb-4" />

        <ImageUploaderField
          withCrop
          required
          name="images"
          label="تصاویر ملک"
          maxImageCount={10}
          uploadFileType={FileTypeEnums.PROPERTY_IMAGE}
          onUploadStateChange={setUploadState}
          downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
          uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
        />

        <InputNumberField
          required
          suffix="متر"
          placeholder="50"
          decimalScale={2}
          decimalSeparator="/"
          label="متراژ"
          name="property_info.area"
        />

        <DatePickerField
          required
          format="yyyy"
          label="سال ساخت"
          valueFormat="yyyy-MM-dd"
          dayPicker={false}
          monthPicker={false}
          placeholder="انتخاب کنید"
          suffixIcon={<ChevronDownIcon />}
          name="property_info.build_year"
        />

        <div className="mb-4">
          <CheckboxField label="بازسازی شده" name="property_info.is_rebuilt" />
        </div>

        {isRental ? (
          <>
            <InputNumberField
              required
              suffix="تومان"
              decimalScale={2}
              placeholder="2,000,000"
              decimalSeparator="/"
              label="مبلغ رهن"
              name="deposit_amount"
            />

            <InputNumberField
              required
              decimalScale={2}
              suffix="تومان"
              placeholder="2,000,000"
              decimalSeparator="/"
              label="مبلغ اجاره"
              name="rent_amount"
            />

            <div className="mb-4">
              <CheckboxField label="قابل تبدیل" name="property_info.dynamic_amounts" />
            </div>
          </>
        ) : (
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
        )}

        <div className="flex flex-col gap-2 mb-4">
          <span>تعداد اتاق</span>
          <RoomSelection
            maxRooms={4}
            value={methods.getValues('property_info.number_of_rooms')}
            onChange={(rooms) => methods.setValue('property_info.number_of_rooms', rooms)}
          />
        </div>

        <SelectField
          asValue
          multiSelect
          label="سایر امکانات"
          name="property_info.other_facilities"
          options={propertyFacilitiesType}
        />

        <div className="flex flex-col gap-3">
          <div className="flex justify-start gap-4">
            <CheckboxField label="آسانسور" name="property_info.elevator" />
            <CheckboxField label="انباری" name="property_info.storage_room" />
            <CheckboxField label="پارکینگ" name="property_info.parking" />
          </div>
        </div>

        <InputField
          required
          label="عنوان آگهی"
          name="title"
          placeholder="آگهی شما با این عنوان نمایش داده خواهد شد"
        />

        <InputField multiline label="توضیحات" name="description" />

        <div className="bg-rust-100 fa flex -mx-6 p-5 text-rust-600 justify-center">
          <span>هزینه آگهی:</span>
          <span className="text-xl ml-2 mr-14">0</span>
          <span className="text-rust-300">
            <TomanIcon />
          </span>
        </div>

        <BottomCTA>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={loading}
              onClick={handlePreview}
            >
              پیش نمایش
            </Button>
            <Button type="submit" className="w-full" loading={loading}>
              {isEditMode ? 'بروزرسانی آگهی' : 'انتشار آگهی'}
            </Button>
          </div>
        </BottomCTA>
      </Form>
    </div>
  )
}
