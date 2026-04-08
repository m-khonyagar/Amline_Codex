import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SelectCityField,
  useDownloadFile,
  useGetDistrict,
  useRentalCommission,
  useGetRegions,
  useUploadFile,
} from '@/features/misc'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { useDebounce } from '@/hooks/use-debounce'
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
import { Dialog } from '@/components/ui/Dialog'
import LocationPickerInput from '@/components/ui/Location/LocationPickerInput'
import { toast } from '@/components/ui/Toaster'
import { FileType } from '@/data/enums/file_enums'
import {
  FileStatusEnum,
  FileStatusOptions,
  MonopolyEnum,
  MonopolyOptions,
} from '@/data/enums/market_enums'
import {
  PropertyCharacteristicsTypeOptions,
  PropertyCoolingSystemTypeOptions,
  PropertyFacilitiesTypeOptions,
  PropertyFlooringTypeOptions,
  PropertyHeatingSystemTypeOptions,
  PropertyKitchenTypeOptions,
  PropertyOccupancyStatusOptions,
  PropertyParkingTypeOptions,
  PropertyRestroomTypeOptions,
  PropertyRoomCountOptions,
  PropertyTypeOptions,
} from '@/data/enums/property-enums'
import { userGender, userGenderOptions } from '@/data/enums/user-enums'
import { handleErrorOnSubmit } from '@/utils/error'
import { toEnglishDigits } from '@/utils/number'
import { pickWithDefaults } from '@/utils/object'
import { mobileNumberSchema } from '@/utils/schema'
import ExistingFilesDialog from '../ExistingFilesDialog'
import { useCreateLandlordFiles } from '../../api/create-landlord-files'
import { useUpdateLandlordFiles } from '../../api/update-landlord-files'
import { useGetLandlordFileInfo } from '../../api/get-landlord-files'
import { useGetAdModerators } from '../../api/get-ad-moderators'
import { useGetFileSources } from '../../api/file-sources'
import { useGetFileLabels } from '../../api/file-labels'
import { useGetExistingMobile } from '../../api/get-existing-mobile'
import {
  CheckIcon,
  CloseIcon,
  PhoneIcon,
  PlusIcon,
  SquareMeterIcon,
  UserIcon,
} from '@/components/icons'

const formSchema = z.object({
  listing_type: z.literal('RENT'),
  file_status: z.enum(Object.values(FileStatusEnum), { message: 'وضعیت فایل الزامی است' }),
  assigned_to: z.string().nullable(),
  file_source_id: z.union([z.string(), z.number()]).optional(),
  description: z.string().optional(),
  mobile: mobileNumberSchema,
  second_mobile: z.union([mobileNumberSchema, z.string().length(0)]).optional(),
  full_name: z.string().optional(),
  gender: z.enum(Object.values(userGender)).optional(),
  rent: z.number().min(0, 'مبلغ اجاره نمی‌تواند منفی باشد').optional(),
  deposit: z.number().min(0, 'مبلغ رهن نمی‌تواند منفی باشد').optional(),
  dynamic_amount: z.boolean(),
  city_id: z.union([z.string(), z.number()]).optional(),
  district_id: z.union([z.string(), z.number()]).optional(),
  region: z.union([z.string(), z.number()]).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  property_type: z.string().optional(),
  room_count: z.number().min(0).max(4),
  area: z.number().min(0, 'متراژ نمی‌تواند منفی باشد').optional(),
  build_year: z.union([z.string(), z.number()]).optional(),
  bathroom: z.array(z.string()),
  heating: z.array(z.string()),
  cooling: z.array(z.string()),
  flooring: z.array(z.string()),
  max_tenants: z.number().min(0).optional(),
  other_facilities: z.array(z.string()),
  kitchen: z.array(z.string()),
  property_characteristics: z.array(z.string()),
  floor: z.string().optional(),
  total_floors: z.string().optional(),
  occupancy_status: z.string().optional(),
  parking_type: z.string().optional(),
  parking_count: z.number().optional(),
  visit_time: z.string().optional(),
  evacuation_date: z.string().optional(),
  label_ids: z.array(z.union([z.string(), z.number()])),
  elevator: z.boolean(),
  storage: z.boolean(),
  property_image_file_ids: z.array(z.any()),
  monopoly: z.enum(Object.values(MonopolyEnum)).optional(),
  reason_for_not_removing_ad: z.string().optional(),
  divar_ad_link: z.string().optional(),
  eitaa_ad_link: z.string().optional(),
})

const defaultValues = {
  listing_type: 'RENT',
  file_status: undefined,
  assigned_to: null,
  file_source_id: undefined,
  description: undefined,
  mobile: undefined,
  second_mobile: undefined,
  full_name: undefined,
  gender: undefined,
  rent: undefined,
  deposit: undefined,
  dynamic_amount: false,
  city_id: '712',
  district_id: undefined,
  region: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined,
  property_type: undefined,
  room_count: 0,
  area: undefined,
  build_year: undefined,
  bathroom: [],
  heating: [],
  cooling: [],
  flooring: [],
  max_tenants: undefined,
  other_facilities: [],
  kitchen: [],
  property_characteristics: [],
  floor: undefined,
  total_floors: undefined,
  occupancy_status: undefined,
  parking_type: undefined,
  parking_count: undefined,
  visit_time: undefined,
  evacuation_date: undefined,
  label_ids: [],
  elevator: false,
  storage: false,
  property_image_file_ids: [],
  monopoly: undefined,
  reason_for_not_removing_ad: undefined,
  divar_ad_link: undefined,
  eitaa_ad_link: undefined,
}

export const DepositRentLandlordForm = ({ id }) => {
  const navigate = useNavigate()

  const isEditMode = !!id
  const getLandlordFileQuery = useGetLandlordFileInfo(id)
  const data = isEditMode && getLandlordFileQuery.data

  const methods = useForm({
    values: pickWithDefaults(
      {
        ...data,
        build_year: data?.build_year ? `${data.build_year.toString()}-06-01` : undefined,
        property_image_file_ids: (data?.property_image_file_ids || []).map((i) => ({ id: i })),
      },
      defaultValues
    ),
    resolver: zodResolver(formSchema),
  })

  const { data: adModerators = [] } = useGetAdModerators()
  const adModeratorOptions = adModerators.map((moderator) => ({
    value: moderator.id,
    label: moderator.fullname,
  }))

  const { data: fileSources = [] } = useGetFileSources()
  const fileSourceOptions = fileSources.map((src) => ({ label: src.title, value: String(src.id) }))

  const queryClient = useQueryClient()
  const mobile = toEnglishDigits(methods.watch('mobile'))
  const { data: existingFiles = [], isLoading: isCheckingMobile } = useGetExistingMobile(mobile, {
    enabled: !isEditMode && !!mobile && mobile.length === 11,
  })

  const selectedCity = methods.watch('city_id')
  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const districtOptions = (districtOptionQuery.data || []).map((item) => ({
    label: `${item.name} ${item.region !== 'None' ? `- منطقه ${item.region}` : ''}`,
    value: item.id,
  }))

  const regionOptionQuery = useGetRegions(selectedCity, { enabled: !!selectedCity })
  const regionOptions = (regionOptionQuery.data || []).map((item) => ({
    label: `منطقه ${item}`,
    value: item,
  }))

  const [uploadState, setUploadState] = useState(false)
  const [showSecondMobile, setShowSecondMobile] = useState(!!data?.second_mobile)
  const downloadFileMutation = useDownloadFile()
  const uploadMutation = useUploadFile({ fileType: FileType.PROPERTY_IMAGE })

  const rent = methods.watch('rent')
  const deposit = methods.watch('deposit')
  const debouncedRent = useDebounce(rent, 1000)
  const debouncedDeposit = useDebounce(deposit, 1000)

  const commissionQuery = useRentalCommission(
    {
      security_deposit_amount: debouncedDeposit,
      rent_amount: debouncedRent,
    },
    { enabled: !!debouncedRent && !!debouncedDeposit }
  )

  const { data: fileLabels = [] } = useGetFileLabels()
  const fileLabelOptions = fileLabels.map((label) => ({
    label: label.title,
    value: String(label.id),
  }))

  const createLandlordFiles = useCreateLandlordFiles()
  const updateLandlordFiles = useUpdateLandlordFiles(id, { enabled: isEditMode })

  const create = (_data) => {
    createLandlordFiles.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success('فایل رهن و اجاره با موفقیت ایجاد شد')
        navigate(`/market/deposit-rent/landlord/${data.id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const update = (_data) => {
    updateLandlordFiles.mutate(_data, {
      onSuccess: () => {
        toast.success('فایل رهن و اجاره با موفقیت ویرایش شد')
        navigate(`/market/deposit-rent/landlord/${id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const handleSubmit = (data) => {
    if (uploadState === 'loading') {
      toast.error('تا بارگذاری کامل فایل ها صبر کنید.')
      return
    }

    if (uploadState === 'error') {
      toast.error('خطا در بارگذاری ها فایل')
      return
    }

    let buildYear = data.build_year
    if (typeof buildYear === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(buildYear))
      buildYear = buildYear.slice(0, 4)

    const _data = {
      ...data,
      build_year: buildYear,
      mobile: data.mobile.replace(/^9/, '09'),
      second_mobile: data.second_mobile ? data.second_mobile.replace(/^9/, '09') : null,
      property_image_file_ids: data.property_image_file_ids.map(
        (i) => i.uploadResponse?.data?.id || i.id
      ),
    }

    if (isEditMode) update(_data)
    else create(_data)
  }

  return (
    <div className="bg-white rounded-lg p-4 pb-10">
      <LoadingAndRetry query={isEditMode ? getLandlordFileQuery : {}}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4">
            <div className="col-span-full text-xl mb-4 mt-2 font-medium">وضعیت فایل</div>
            <SelectField
              asValue
              label="وضعیت فایل"
              name="file_status"
              options={FileStatusOptions}
            />
            <SelectField
              asValue
              label="ارجاع به کارشناس"
              name="assigned_to"
              options={adModeratorOptions}
            />
            <SelectField
              asValue
              label="منبع فایل"
              name="file_source_id"
              options={fileSourceOptions}
            />
            <InputField label="توضیح وضعیت فایل" name="description" multiline />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">مشخصات مالک</div>
            <div>
              <InputField
                label="شماره موبایل"
                name="mobile"
                placeholder="۱۱ رقم"
                suffixIcon={<PhoneIcon />}
              />
              {!showSecondMobile && (
                <div className="col-span-full">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-base text-primary"
                    onClick={() => setShowSecondMobile(true)}
                  >
                    <PlusIcon size={20} className="ml-1" />
                    وارد کردن شماره دوم
                  </Button>
                </div>
              )}
            </div>
            {showSecondMobile && (
              <InputField
                label="شماره موبایل دوم"
                name="second_mobile"
                placeholder="۱۱ رقم"
                suffixIcon={<PhoneIcon />}
              />
            )}
            <InputField label="نام و نام خانوادگی" name="full_name" suffixIcon={<UserIcon />} />
            <SelectField asValue label="جنسیت" name="gender" options={userGenderOptions} />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">مبلغ</div>
            <InputNumberField label="مبلغ اجاره ماهانه" name="rent" suffixIcon={<CheckIcon />} />
            <InputNumberField label="مبلغ رهن" name="deposit" suffixIcon={<CheckIcon />} />
            {commissionQuery.data && !commissionQuery.isLoading && (
              <div className="min-h-[48px] text-sm px-6 bg-[#F6FBFB] rounded-lg font-medium fa mt-auto mb-[16px] py-4">
                <span className="text-primary font-medium">
                  کمیسیون این ملک برای هر یک از طرفین:{' '}
                </span>
                <span className="text-gray-600">
                  {commissionQuery.data.commission?.toLocaleString()} تومان
                </span>
              </div>
            )}
            <div className="flex items-center">
              <CheckboxField label="قابل تبدیل" name="dynamic_amount" />
            </div>

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">آدرس ملک</div>
            <SelectCityField label="شهر" name="city_id" />
            <SelectField
              asValue
              searchable
              label="محله"
              name="district_id"
              options={districtOptions}
            />
            <SelectField asValue label="منطقه" name="region" options={regionOptions} />
            <InputField label="جزئیات آدرس" name="address" multiline />
            <LocationPickerInput
              label="موقعیت ملک"
              value={(function () {
                const { latitude, longitude } = methods.watch()
                return latitude && longitude ? [latitude, longitude] : undefined
              })()}
              onChange={(data) => {
                if (Array.isArray(data) && data.length === 2) {
                  const [lat, lng] = data
                  methods.setValue('latitude', lat)
                  methods.setValue('longitude', lng)
                } else {
                  methods.setValue('latitude', undefined)
                  methods.setValue('longitude', undefined)
                }
              }}
            />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">جزئیات ملک</div>
            <SelectField
              asValue
              searchable
              label="نوع و کاربری ملک"
              name="property_type"
              options={PropertyTypeOptions}
            />
            <SelectField
              asValue
              label="تعداد اتاق"
              name="room_count"
              options={PropertyRoomCountOptions}
            />
            <InputNumberField
              label="متراژ"
              name="area"
              suffixIcon={<SquareMeterIcon size={30} />}
            />
            <DatePickerField
              label="سال ساخت"
              name="build_year"
              onlyYearPicker
              inputFormat="yyyy-MM-dd"
              format="YYYY"
              outputFormat="YYYY"
            />
            <SelectField
              asValue
              multiSelect
              label="سرویس بهداشتی"
              name="bathroom"
              options={PropertyRestroomTypeOptions}
            />
            <SelectField
              asValue
              multiSelect
              label="سیستم گرمایشی"
              name="heating"
              options={PropertyHeatingSystemTypeOptions}
            />
            <SelectField
              asValue
              multiSelect
              label="سرویس سرمایشی"
              name="cooling"
              options={PropertyCoolingSystemTypeOptions}
            />
            <SelectField
              asValue
              multiSelect
              label="نوع کفپوش"
              name="flooring"
              options={PropertyFlooringTypeOptions}
            />
            <InputNumberField label="به چند نفر اجاره میدهید؟" name="max_tenants" />
            <SelectField
              asValue
              multiSelect
              label="سایر امکانات"
              name="other_facilities"
              options={PropertyFacilitiesTypeOptions}
            />
            <SelectField
              asValue
              multiSelect
              label="آشپزخانه"
              name="kitchen"
              options={PropertyKitchenTypeOptions}
            />
            <SelectField
              asValue
              multiSelect
              label="مشخصه ملک"
              name="property_characteristics"
              options={PropertyCharacteristicsTypeOptions}
            />
            <InputField label="طبقه واحد مورد معامله" name="floor" />
            <InputField label="تعداد طبقات ساختمان" name="total_floors" />
            <SelectField
              asValue
              label="وضعیت سکونت"
              name="occupancy_status"
              options={PropertyOccupancyStatusOptions}
            />
            <div className="grid grid-cols-2 items-end gap-2">
              <SelectField
                asValue
                label="نوع و تعداد پارکینگ"
                placeholder="نوع پارکینگ"
                name="parking_type"
                options={PropertyParkingTypeOptions}
              />
              <InputNumberField placeholder="تعداد پارکینگ" name="parking_count" />
            </div>
            <InputField label="ساعت و تاریخ بازدید" name="visit_time" />
            <DatePickerField label="تاریخ تخلیه" name="evacuation_date" />
            <SelectField
              asValue
              multiSelect
              label="انتخاب برچسب"
              name="label_ids"
              options={fileLabelOptions}
            />
            <div>
              <p className="mb-1">امکانات ساختمان</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0">
                <CheckboxField label="آسانسور" name="elevator" />
                <CheckboxField label="انباری" name="storage" />
              </div>
            </div>

            <div className="col-span-full mt-5">
              <ImageUploaderField
                multiple
                label="تصویر ملک"
                name="property_image_file_ids"
                getValues={methods.getValues}
                onUploadStateChange={setUploadState}
                downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
                uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
              />
            </div>

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">همکاری با املاین</div>
            <SelectField
              asValue
              label="مالک حاضر به حذف آگهی دیوار بود؟"
              name="monopoly"
              options={MonopolyOptions}
            />
            <InputField label="دلیل عدم حذف آگهی توسط مالک" name="reason_for_not_removing_ad" />
            <InputField label="لینک آگهی دیوار" name="divar_ad_link" />
            <InputField label="لینک آگهی ایتا" name="eitaa_ad_link" />
          </div>

          <div className="mt-4 text-left">
            <Button
              size="sm"
              variant="gray"
              onClick={() => navigate(-1)}
              disabled={createLandlordFiles.isPending || updateLandlordFiles.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              disabled={isCheckingMobile}
              loading={createLandlordFiles.isPending || updateLandlordFiles.isPending}
            >
              <PlusIcon size={14} className="ml-1" />
              {isEditMode ? 'ویرایش' : 'ایجاد'}
            </Button>
          </div>
        </Form>
      </LoadingAndRetry>

      <Dialog
        title="هشدار"
        open={existingFiles.length > 0}
        onOpenChange={() => queryClient.setQueryData(['existing-mobile', mobile], [])}
      >
        <ExistingFilesDialog
          onClose={() => queryClient.setQueryData(['existing-mobile', mobile], [])}
          existingFiles={existingFiles}
        />
      </Dialog>
    </div>
  )
}
