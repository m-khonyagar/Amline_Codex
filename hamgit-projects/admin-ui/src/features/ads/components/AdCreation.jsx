import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import {
  CheckboxField,
  DatePickerField,
  Form,
  ImageUploaderField,
  InputField,
  InputNumberField,
  SelectField,
  useForm,
} from '@/components/ui/Form'
import { useGetAdInfo } from '../api/get-ad-info'
import { SelectCityField, useDownloadFile, useGetDistrict, useUploadFile } from '@/features/misc'
import { useCreateAd, useUpdateAd } from '../api/create-ad'
import { FileType } from '@/data/enums/file_enums'
import { PropertyFacilitiesTypeOptions, PropertyTypeOptions } from '@/data/enums/property-enums.js'
import { RequirementTypeEnums } from '@/data/enums/requirement_enums'
import { handleErrorOnSubmit } from '@/utils/error'
import { pickWithDefaults } from '@/utils/object'
import { toEnglishDigits } from '@/utils/number'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { mobileNumberSchema } from '@/utils/schema'

const roomOptions = [
  { label: 'بدون اتاق', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
]

const getFormSchema = (isEditMode, isRental) => {
  return z.object({
    ...(isEditMode ? {} : { mobile: mobileNumberSchema }),
    title: z.string({ required_error: 'عنوان آگهی الزامی است' }),
    city_id: z.string({ required_error: 'شهر الزامی است' }),
    district_id: z.string(),
    image_file_ids: z.array(z.object({})),
    location: z.object({}).optional(),
    ...(isRental
      ? {
          deposit_amount: z.number({ required_error: 'مبلغ رهن الزامی است' }),
          rent_amount: z.number({ required_error: 'مبلغ اجاره الزامی است' }),
        }
      : { sale_price: z.number({ required_error: 'قیمت کل الزامی است' }) }),
    description: z.string().optional(),
    type: z.string(),
    dynamic_amounts: z.boolean(),
    property_info: z.object({
      property_type: z.string({ required_error: 'نوع ملک الزامی است' }),
      area: z.number({ required_error: 'متراژ الزامی است' }),
      build_year: z.string({ required_error: 'سال ساخت الزامی است' }),
      is_rebuilt: z.boolean(),
      number_of_rooms: z.string(),
      other_facilities: z.array(z.string()),
      parking: z.boolean(),
      storage_room: z.boolean(),
      elevator: z.boolean(),
    }),
  })
}

const defaultValues = {
  mobile: '',
  title: undefined,
  city_id: undefined,
  district_id: '',
  image_file_ids: [],
  location: {},
  deposit_amount: undefined,
  rent_amount: undefined,
  sale_price: undefined,
  description: undefined,
  type: '',
  dynamic_amounts: false,
  property_info: {
    property_type: undefined,
    area: undefined,
    build_year: undefined,
    is_rebuilt: false,
    number_of_rooms: '0',
    other_facilities: [],
    parking: false,
    storage_room: false,
    elevator: false,
  },
}

const AdCreation = ({ adId, onCancel, onSuccess }) => {
  const getAdQuery = useGetAdInfo(adId, { enabled: !!adId })
  const ad = adId && getAdQuery.data

  const [typeId, setTypeIdTab] = useState(ad?.type || RequirementTypeEnums.FOR_SALE)
  const isRental = typeId === RequirementTypeEnums.FOR_RENT
  const hasData = !!ad?.id

  useEffect(() => {
    if (ad) setTypeIdTab(ad.type)
  }, [ad])

  const createAd = useCreateAd()
  const updateAd = useUpdateAd(ad?.id, { enabled: hasData })

  const [uploadState, setUploadState] = useState(false)
  const downloadFileMutation = useDownloadFile()
  const uploadMutation = useUploadFile({ fileType: FileType.PROPERTY_IMAGE })

  const formSchema = getFormSchema(!!ad?.id, isRental)
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
    values: {
      ...pickWithDefaults(
        {
          ...ad,
          district_id: ad?.district_id === 'None' ? '' : ad?.district_id,
          image_file_ids: (ad?.image_file_ids || []).map((i) => {
            return { id: i }
          }),
        },
        defaultValues
      ),
      property_info: {
        ...pickWithDefaults(ad?.property, defaultValues.property_info),
        number_of_rooms: ad?.property.number_of_rooms?.toString() || '0',
      },
    },
  })

  const create = (_data) => {
    createAd.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`آگهی با موفقیت ایجاد شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const update = (_data) => {
    updateAd.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`آگهی با موفقیت ویرایش شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleSubmit = () => {
    const data = methods.getValues()

    if (uploadState === 'loading') {
      toast.error('تا بارگذاری کامل فایل ها صبر کنید.')
      return
    }

    if (uploadState === 'error') {
      toast.error('خطا در بارگذاری ها فایل')
      return
    }

    const _data = {
      ...data,
      type: isRental ? RequirementTypeEnums.FOR_RENT : RequirementTypeEnums.FOR_SALE,
      mobile: data.mobile.replace(/^9/, '09'),
      deposit_amount: isRental ? toEnglishDigits(data.deposit_amount) : undefined,
      rent_amount: isRental ? toEnglishDigits(data.rent_amount) : undefined,
      sale_price: isRental ? undefined : toEnglishDigits(data.sale_price),
      image_file_ids: data.image_file_ids.map((i) => i.uploadResponse?.data?.id || i.id),
      district_id: data.district_id || null,
      property_info: {
        ...data.property_info,
        area: toEnglishDigits(data.property_info.area),
        number_of_rooms: toEnglishDigits(data.property_info.number_of_rooms),
      },
    }

    if (ad?.id) update(_data)
    else create(_data)
  }

  const selectedCity = methods.watch('city_id')
  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const districtOptions = (districtOptionQuery.data || []).map((item) => {
    return {
      label: item.name,
      value: `${item.id}`,
      city_id: `${item.city_id}`,
    }
  })

  return (
    <div className="bg-white rounded-lg p-4">
      <LoadingAndRetry query={adId ? getAdQuery : {}}>
        <Tabs value={typeId} dir="rtl" onValueChange={setTypeIdTab} className="mb-6">
          <TabsList>
            <TabsTrigger
              value={RequirementTypeEnums.FOR_SALE}
              className="text-base"
              disabled={!!ad}
            >
              خرید
            </TabsTrigger>

            <TabsTrigger
              value={RequirementTypeEnums.FOR_RENT}
              className="text-base"
              disabled={!!ad}
            >
              رهن و اجاره
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-x-4">
            {!hasData && (
              <InputField
                ltr
                required
                isNumeric
                name="mobile"
                label="شماره موبایل کاربر"
                suffix={<span className="mt-0.5">+98</span>}
              />
            )}

            <InputField required name="title" label="عنوان آگهی" />

            <SelectField
              required
              asValue
              label="نوع و کاربری ملک"
              name="property_info.property_type"
              options={PropertyTypeOptions}
            />

            <SelectCityField label="شهر" required name="city_id" />

            <SelectField asValue label="محله" name="district_id" options={districtOptions} />

            <InputNumberField required min={0} label="متر" name="property_info.area" />

            <DatePickerField
              required
              label="سال ساخت"
              name="property_info.build_year"
              onlyYearPicker
              inputFormat="yyyy"
              format="YYYY"
              outputFormat="YYYY"
            />

            {isRental ? (
              <>
                <InputNumberField min={0} label="مبلغ رهن" name="deposit_amount" />
                <InputNumberField min={0} label="مبلغ اجاره" name="rent_amount" />
                <div className="md:mt-8">
                  <CheckboxField label="قابل تبدیل" name="dynamic_amounts" />
                </div>
              </>
            ) : (
              <InputNumberField min={0} label="قیمت کل" name="sale_price" />
            )}

            <SelectField
              asValue
              label="تعداد اتاق"
              options={roomOptions}
              name="property_info.number_of_rooms"
            />

            <SelectField
              label="امکانات"
              asValue
              multiSelect
              options={PropertyFacilitiesTypeOptions}
              name="property_info.other_facilities"
            />

            <InputField name="description" label="توضیحات" multiline />

            <div className="md:mt-8">
              <CheckboxField label="بازسازی شده" name="property_info.is_rebuilt" />
            </div>

            <div>
              <p className="mb-1">امکانات ساختمان</p>
              <div className="flex gap-3">
                <CheckboxField label="آسانسور" name="property_info.elevator" />
                <CheckboxField label="انباری" name="property_info.storage_room" />
                <CheckboxField label="پارکینگ" name="property_info.parking" />
              </div>
            </div>
          </div>

          <div className="md:mt-8">
            <ImageUploaderField
              multiple
              label="تصاویر"
              name="image_file_ids"
              getValues={methods.getValues}
              onUploadStateChange={setUploadState}
              downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
              uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
            />
          </div>

          <div className="mt-4 text-left">
            {onCancel && (
              <Button
                size="sm"
                variant="gray"
                onClick={onCancel}
                disabled={createAd.isPending || updateAd.isPending}
              >
                <CloseIcon size={14} className="ml-1" /> انصراف
              </Button>
            )}

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              loading={createAd.isPending || updateAd.isPending}
            >
              {adId ? (
                <>
                  <DocumentEditIcon size={14} className="ml-1" />
                  ویرایش
                </>
              ) : (
                <>
                  <PlusIcon size={14} className="ml-1" />
                  ایجاد
                </>
              )}
            </Button>
          </div>
        </Form>
      </LoadingAndRetry>
    </div>
  )
}

export default AdCreation
