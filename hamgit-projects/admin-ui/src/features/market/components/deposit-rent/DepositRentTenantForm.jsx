import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import {
  CheckboxField,
  DatePickerField,
  Form,
  InputField,
  InputNumberField,
  SelectField,
  useForm,
} from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import { FileStatusEnum, FileStatusOptions } from '@/data/enums/market_enums'
import { paymentMethod, paymentMethodOptions } from '@/data/enums/prcontract-enums'
import {
  PropertyCoolingSystemTypeOptions,
  PropertyFacilitiesTypeOptions,
  PropertyFlooringTypeOptions,
  PropertyHeatingSystemTypeOptions,
  PropertyRestroomTypeOptions,
  PropertyRoomCountOptions,
  PropertyTypeOptions,
} from '@/data/enums/property-enums'
import { userGender, userGenderOptions } from '@/data/enums/user-enums'
import {
  SelectCityField,
  useGetDistrict,
  useRentalCommission,
  useGetRegions,
} from '@/features/misc'
import { Dialog } from '@/components/ui/Dialog'
import { handleErrorOnSubmit } from '@/utils/error'
import { toEnglishDigits } from '@/utils/number'
import { pickWithDefaults } from '@/utils/object'
import { mobileNumberSchema } from '@/utils/schema'
import ExistingFilesDialog from '../ExistingFilesDialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGetExistingMobile } from '../../api/get-existing-mobile'
import { useCreateTenantFiles } from '../../api/create-tenant-files'
import { useGetTenantFileInfo } from '../../api/get-tenant-files'
import { useUpdateTenantFiles } from '../../api/update-tenant-files'
import { useGetAdModerators } from '../../api/get-ad-moderators'
import { useGetFileSources } from '../../api/file-sources'
import { useGetFileLabels } from '../../api/file-labels'
import {
  CheckIcon,
  CloseIcon,
  PhoneIcon,
  PlusIcon,
  SquareMeterIcon,
  UserIcon,
} from '@/components/icons'
import { useDebounce } from '@/hooks/use-debounce'

const formSchema = z.object({
  listing_type: z.literal('RENT'),
  file_status: z.enum(Object.values(FileStatusEnum), { message: 'وضعیت فایل الزامی است' }),
  assigned_to: z.string().nullable(),
  file_source_id: z.string().optional(),
  description: z.string().optional(),
  mobile: mobileNumberSchema,
  full_name: z.string().optional(),
  gender: z.enum(Object.values(userGender)).optional(),
  family_members_count: z.number().min(0, 'تعداد خانواده نمی‌تواند منفی باشد').optional(),
  children_ages_description: z.string().optional(),
  tenant_deadline: z.string().optional(),
  job: z.string().optional(),
  rent: z.number().min(0, 'مبلغ اجاره نمی‌تواند منفی باشد').optional(),
  deposit: z.number().min(0, 'مبلغ رهن نمی‌تواند منفی باشد').optional(),
  payment_method: z.enum(Object.values(paymentMethod)).optional(),
  city_id: z.union([z.string(), z.number()]).optional(),
  district_ids: z.array(z.union([z.string(), z.number()])),
  regions: z.array(z.union([z.string(), z.number()])),
  address_description: z.string().optional(),
  property_type: z.string().optional(),
  room_count: z.number().min(0).max(4),
  area: z.number().min(0, 'متراژ نمی‌تواند منفی باشد').optional(),
  build_year: z.union([z.string(), z.number()]).optional(),
  bathroom: z.array(z.string()),
  heating: z.array(z.string()),
  cooling: z.array(z.string()),
  flooring: z.array(z.string()),
  other_facilities: z.array(z.string()),
  label_ids: z.array(z.string()),
  elevator: z.boolean(),
  storage: z.boolean(),
  parking: z.boolean(),
  eitaa_ad_link: z.string().optional(),
})

const defaultValues = {
  listing_type: 'RENT',
  file_status: undefined,
  assigned_to: null,
  file_source_id: undefined,
  description: undefined,
  mobile: undefined,
  full_name: undefined,
  gender: undefined,
  family_members_count: undefined,
  children_ages_description: undefined,
  tenant_deadline: undefined,
  job: undefined,
  rent: undefined,
  deposit: undefined,
  payment_method: undefined,
  city_id: '712',
  district_ids: [],
  regions: [],
  address_description: undefined,
  property_type: undefined,
  room_count: 0,
  area: undefined,
  build_year: undefined,
  bathroom: [],
  heating: [],
  cooling: [],
  flooring: [],
  other_facilities: [],
  label_ids: [],
  elevator: false,
  storage: false,
  parking: false,
  eitaa_ad_link: undefined,
}

export const DepositRentTenantForm = ({ id }) => {
  const navigate = useNavigate()

  const isEditMode = !!id
  const getTenantFileQuery = useGetTenantFileInfo(id)
  const data = isEditMode && getTenantFileQuery.data

  const methods = useForm({
    values: pickWithDefaults(
      {
        ...data,
        build_year: data?.build_year ? `${data.build_year.toString()}-06-01` : undefined,
      },
      defaultValues
    ),
    resolver: zodResolver(formSchema),
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

  const queryClient = useQueryClient()
  const mobile = toEnglishDigits(methods.watch('mobile'))
  const { data: existingFiles = [], isLoading: isCheckingMobile } = useGetExistingMobile(mobile, {
    enabled: !isEditMode && !!mobile && mobile.length === 11,
  })

  const { data: adModerators = [] } = useGetAdModerators()
  const adModeratorOptions = adModerators.map((moderator) => ({
    value: moderator.id,
    label: moderator.fullname,
  }))

  const createTenantFiles = useCreateTenantFiles()
  const updateTenantFiles = useUpdateTenantFiles(id, { enabled: isEditMode })

  const { data: fileLabels = [] } = useGetFileLabels()
  const fileLabelOptions = fileLabels.map((label) => ({
    label: label.title,
    value: String(label.id),
  }))

  const { data: fileSources = [] } = useGetFileSources()
  const fileSourceOptions = fileSources.map((src) => ({ label: src.title, value: String(src.id) }))

  const create = (_data) => {
    createTenantFiles.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success('فایل رهن و اجاره مستاجر با موفقیت ایجاد شد')
        navigate(`/market/deposit-rent/tenant/${data.id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const update = (_data) => {
    updateTenantFiles.mutate(_data, {
      onSuccess: () => {
        toast.success('فایل رهن و اجاره مستاجر با موفقیت ویرایش شد')
        navigate(`/market/deposit-rent/tenant/${id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const handleSubmit = (data) => {
    let buildYear = data.build_year
    if (typeof buildYear === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(buildYear))
      buildYear = buildYear.slice(0, 4)

    const _data = {
      ...data,
      build_year: buildYear,
      mobile: data.mobile.replace(/^9/, '09'),
    }

    if (isEditMode) update(_data)
    else create(_data)
  }

  return (
    <div className="bg-white rounded-lg p-4 pb-10">
      <LoadingAndRetry query={isEditMode ? getTenantFileQuery : {}}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4">
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

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">مشخصات مستاجر</div>
            <InputField
              label="شماره موبایل"
              name="mobile"
              placeholder="11 رقم"
              suffixIcon={<PhoneIcon />}
            />
            <InputField label="نام و نام خانوادگی" name="full_name" suffixIcon={<UserIcon />} />
            <SelectField asValue label="جنسیت" name="gender" options={userGenderOptions} />

            {/* Tenant specific fields */}
            <InputNumberField label="تعداد خانواده" name="family_members_count" />
            <InputField label="توضیح سنین فرزندان" name="children_ages_description" />
            <InputField label="مهلت مستاجر" name="tenant_deadline" />
            <InputField label="شغل" name="job" />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">توانایی پرداخت</div>
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
            <SelectField
              asValue
              label="نحوه پرداخت"
              name="payment_method"
              options={paymentMethodOptions}
            />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">آدرس ملک مورد نیاز</div>
            <SelectCityField label="شهر" name="city_id" />
            <SelectField
              asValue
              searchable
              multiSelect
              label="محله"
              name="district_ids"
              options={districtOptions}
            />
            <SelectField asValue multiSelect label="منطقه" name="regions" options={regionOptions} />
            <InputField label="توضیحات آدرس" name="address_description" multiline />

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">جزئیات ملک مورد نیاز</div>
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
              label="برچسب ها"
              name="label_ids"
              options={fileLabelOptions}
            />
            <div>
              <p className="mb-1">امکانات ساختمان</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0">
                <CheckboxField label="آسانسور" name="elevator" />
                <CheckboxField label="انباری" name="storage" />
                <CheckboxField label="پارکینگ" name="parking" />
              </div>
            </div>

            <div className="col-span-full text-xl mb-4 mt-8 font-medium">همکاری با املاین</div>
            <InputField label="لینک آگهی ایتا" name="eitaa_ad_link" />
          </div>

          <div className="mt-4 text-left">
            <Button
              size="sm"
              variant="gray"
              onClick={() => navigate(-1)}
              disabled={createTenantFiles.isPending || updateTenantFiles.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              disabled={isCheckingMobile}
              loading={createTenantFiles.isPending || updateTenantFiles.isPending}
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
