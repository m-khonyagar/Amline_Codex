import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import {
  FileStatusEnum,
  SpecializationEnum,
  SpecializationOptions,
} from '@/data/enums/market_enums'
import { userGender, userGenderOptions } from '@/data/enums/user-enums'
import { mobileNumberSchema } from '@/utils/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { toEnglishDigits } from '@/utils/number'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import ExistingFilesDialog from './ExistingFilesDialog'
import { useCreateRealtorFiles } from '../api/create-realtor-files'
import { useUpdateRealtorFiles } from '../api/update-realtor-files'
import { useGetRealtorFileInfo } from '../api/get-realtor-files'
import { useGetExistingMobile } from '../api/get-existing-mobile'
import { SelectCityField, useGetDistrict, useGetRegions } from '@/features/misc'
import { CloseIcon, PhoneIcon, PlusIcon, UserIcon } from '@/components/icons'

const formSchema = z.object({
  file_status: z.enum(Object.values(FileStatusEnum)).optional(),
  assigned_to: z.string().nullable(),
  file_source_id: z.string().optional(),
  description: z.string().optional(),
  mobile: mobileNumberSchema,
  full_name: z.string().optional(),
  gender: z.enum(Object.values(userGender)).optional(),
  city_id: z.union([z.string(), z.number()]).optional(),
  district_ids: z.array(z.union([z.string(), z.number()])),
  regions: z.array(z.union([z.string(), z.number()])),
  specialization: z.array(z.enum(Object.values(SpecializationEnum))),
  office_name: z.string().optional(),
  office_address: z.string().optional(),
  office_phone: z.string().optional(),
})

const defaultValues = {
  file_status: FileStatusEnum.INFO_COMPLETED,
  assigned_to: null,
  file_source_id: undefined,
  description: undefined,
  mobile: undefined,
  full_name: undefined,
  gender: undefined,
  city_id: '712',
  district_ids: [],
  regions: [],
  specialization: [],
  office_name: undefined,
  office_address: undefined,
  office_phone: undefined,
}

export const RealtorForm = ({ id }) => {
  const navigate = useNavigate()

  const isEditMode = !!id
  const getRealtorFileQuery = useGetRealtorFileInfo(id)
  const data = isEditMode ? getRealtorFileQuery.data : {}

  const methods = useForm({
    values: pickWithDefaults({ ...data }, defaultValues),
    resolver: zodResolver(formSchema),
  })

  const queryClient = useQueryClient()
  const mobile = toEnglishDigits(methods.watch('mobile'))
  const { data: existingFiles = [], isLoading: isCheckingMobile } = useGetExistingMobile(mobile, {
    enabled: !isEditMode && !!mobile && mobile.length === 11,
  })

  // const { data: adModerators = [] } = useGetAdModerators()
  // const adModeratorOptions = adModerators.map((moderator) => ({
  //   label: moderator.fullname,
  //   value: String(moderator.id),
  // }))

  // const { data: fileSources = [] } = useGetFileSources()
  // const fileSourceOptions = fileSources.map((src) => ({ label: src.title, value: String(src.id) }))

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

  const createRealtorFiles = useCreateRealtorFiles()
  const updateRealtorFiles = useUpdateRealtorFiles(id, { enabled: isEditMode })

  const create = (_data) => {
    createRealtorFiles.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success('فایل مشاور املاک با موفقیت ایجاد شد')
        navigate(`/market/realtor/${data.id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const update = (_data) => {
    updateRealtorFiles.mutate(_data, {
      onSuccess: () => {
        toast.success('فایل مشاور املاک با موفقیت ویرایش شد')
        navigate(`/market/realtor/${id}`)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const handleSubmit = (data) => {
    const _data = {
      ...data,
      mobile: data.mobile.replace(/^9/, '09'),
    }

    if (isEditMode) update(_data)
    else create(_data)
  }

  return (
    <div className="bg-white rounded-lg p-4 pb-10">
      <LoadingAndRetry query={isEditMode ? getRealtorFileQuery : {}}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4">
            {/* <div className="col-span-full text-xl mb-4 mt-2 font-medium">وضعیت فایل</div>
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
            /> */}

            <InputField
              label="شماره موبایل"
              name="mobile"
              placeholder="11 رقم"
              suffixIcon={<PhoneIcon />}
            />

            <InputField label="نام و نام خانوادگی" name="full_name" suffixIcon={<UserIcon />} />

            <SelectField asValue label="جنسیت" name="gender" options={userGenderOptions} />

            <InputField label="نام املاک" name="office_name" />

            <SelectField
              asValue
              multiSelect
              label="حوزه فعالیت"
              name="specialization"
              options={SpecializationOptions}
            />

            <SelectCityField label="شهر" name="city_id" />

            <SelectField
              asValue
              multiSelect
              label="مناطق تحت پوشش"
              name="regions"
              options={regionOptions}
            />

            <SelectField
              asValue
              searchable
              multiSelect
              label="محله‌ها"
              name="district_ids"
              options={districtOptions}
            />

            <InputField label="آدرس دفتر یا املاک" name="office_address" multiline />

            <InputField label="توضیحات" name="description" multiline />
          </div>

          <div className="mt-4 text-left">
            <Button
              size="sm"
              variant="gray"
              onClick={() => navigate(-1)}
              disabled={createRealtorFiles.isPending || updateRealtorFiles.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              disabled={isCheckingMobile}
              loading={createRealtorFiles.isPending || updateRealtorFiles.isPending}
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
