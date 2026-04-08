import { useState } from 'react'
import { translateEnum } from '@/utils/enum'
import { SelectCityField, useDownloadFile, useUploadFile } from '@/features/misc'
import { toast } from '@/components/ui/Toaster'
import { convertEmptyStringsToNull, pickWithDefaults } from '@/utils/object'
import { FileType } from '@/data/enums/file_enums'
import ImageUploaderField from '@/components/ui/Form/ImageUploaderField'
import { Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import { PropertyDeedStatusOptions, PropertyTypeOptions } from '@/data/enums/property-enums'
import ImagePreview from '@/components/ui/ImagePreview'

const PRContractPropertyViewSpecifications = ({ property = {} }) => {
  const downloadFileMutation = useDownloadFile()

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">نوع و کاربری ملک:</div>
        <div className="mr-auto">
          {property.property_type
            ? translateEnum(PropertyTypeOptions, property.property_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">وضعیت سند:</div>
        <div className="mr-auto">
          {property.deed_status
            ? translateEnum(PropertyDeedStatusOptions, property.deed_status)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">تصویر سند:</div>
        <div className="mr-auto flex-grow flex flex-wrap gap-2 justify-end">
          {property.deed_image_files?.length > 0
            ? property.deed_image_files.map((f) => (
                <ImagePreview
                  key={f.id}
                  file={f}
                  className="w-full max-w-20"
                  downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
                />
              ))
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">شهر:</div>
        <div className="mr-auto">
          {property.city ? `${property.city.province} - ${property.city.name}` : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">حوزه ثبتی:</div>
        <div className="mr-auto">{property.registration_area || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">پلاک ثبتی اصلی:</div>
        <div className="mr-auto">{property.main_register_number || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">پلاک ثبتی فرعی:</div>
        <div className="mr-auto">{property.sub_register_number || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">شناسه قبض برق:</div>
        <div className="mr-auto">{property.electricity_bill_id || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">کد پستی:</div>
        <div className="mr-auto">{property.postal_code || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">آدرس:</div>
        <div className="mr-auto">{property.address || '-'}</div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">ظرفیت ملک:</div>
        <div className="mr-auto">{property.family_members_count || '-'}</div>
      </div>
    </div>
  )
}

const PRContractPropertyEditSpecificationsForm = ({ property = {}, onSubmit, children }) => {
  const [uploadState, setUploadState] = useState()

  const downloadFileMutation = useDownloadFile()
  const uploadMutation = useUploadFile({ fileType: FileType.PROPERTY_DEED })

  const methods = useForm({
    defaultValues: pickWithDefaults(property, {
      property_type: null,
      deed_status: null,
      deed_image_file_ids: { path: 'deed_image_files', default: [] },
      city_id: { path: 'city.id', default: '' },
      registration_area: '',
      main_register_number: '',
      sub_register_number: '',
      electricity_bill_id: '',
      postal_code: '',
      address: '',
      family_members_count: '',
    }),
  })

  const handleSubmit = (data, methods) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    onSubmit(
      convertEmptyStringsToNull({
        ...data,
        deed_image_file_ids: data.deed_image_file_ids.map(
          (i) => i.uploadResponse?.data?.id || i.id
        ),
      }),
      methods
    )
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <SelectField
        asValue
        searchable
        name="property_type"
        label="نوع و کاربری ملک"
        options={PropertyTypeOptions}
      />

      <SelectField
        asValue
        label="وضعیت سند"
        name="deed_status"
        options={PropertyDeedStatusOptions}
      />

      <ImageUploaderField
        withCrop
        name="deed_image_file_ids"
        label="تصویر سند"
        getValues={methods.getValues}
        // uploadFileType={FileTypeEnums.PROPERTY_DEED}
        onUploadStateChange={setUploadState}
        downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
        uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
      />

      <SelectCityField name="city_id" label="شهر" />

      <InputField label="حوزه ثبتی" placeholder="پنج" name="registration_area" />

      <InputField isNumeric placeholder="31" label="پلاک ثبتی اصلی" name="main_register_number" />

      <InputField isNumeric placeholder="51249" label="پلاک ثبتی فرعی" name="sub_register_number" />

      <InputField
        isNumeric
        type="tel"
        label="شناسه قبض برق"
        placeholder="712345689123"
        name="electricity_bill_id"
      />

      <InputField
        isNumeric
        type="tel"
        label="کد پستی"
        placeholder="0123456789"
        name="postal_code"
      />

      <InputField
        multiline
        label="آدرس"
        convertNumbers
        name="address"
        pattern={{
          value: /[^0-9]/,
          message: 'آدرس نمی‌تواند فقط شامل اعداد باشد.',
        }}
        placeholder="تهران، شهرری، میدان شهدای شاملو، خیابان فرمانداری، کوچه 14، پلاک 32، طبقه سوم، واحد 5"
      />

      <InputField isNumeric placeholder="3" label="ظرفیت ملک" name="family_members_count" />

      {children}
    </Form>
  )
}

export { PRContractPropertyViewSpecifications, PRContractPropertyEditSpecificationsForm }
