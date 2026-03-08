import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import {
  useForm,
  Form,
  InputField,
  DatePickerField,
  SelectField,
  ImageUploaderField,
} from '@/components/ui/Form'
import Field from '@/components/ui/Form/Field'
import RadioButton from '@/components/ui/RadioButton'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { mobileNumberSchema, nationalCodeSchema } from '@/utils/schema'
import { SelectCityField, useGetDistrict, useUploadFile } from '@/features/common'
import { FileTypeEnums } from '@/data/enums/file_type_enums'
import { useRegisterRealtor } from '../api/register-realtor'
import { BottomCTA, HeaderNavigation } from '@/features/app'

const formSchema = z.object({
  mobile: mobileNumberSchema,
  national_code: nationalCodeSchema,
  birth_date: z.string().date('این گزینه اجباریه'),
  address: z.string().min(1, 'این گزینه اجباریه'),
  city_id: z.string().min(1, 'این گزینه اجباریه'),
  district_ids: z.array(z.string()),
  office_name: z.string().min(1, 'این گزینه اجباریه'),
  realtor_type: z.enum(['LICENSE_HOLDER', 'INDEPENDENT_CONSULTANT', 'EMPLOYED_AT_FIRM'], {
    required_error: 'این گزینه اجباریه',
  }),
  avatar_file_id: z.array(z.any()).min(1, 'این گزینه اجباریه'),
})

const defaultValues = {
  mobile: '',
  national_code: '',
  birth_date: '',
  address: '',
  city_id: '',
  district_ids: [],
  office_name: '',
  realtor_type: undefined,
  avatar_file_id: [],
}

export function RealtorPage() {
  const router = useRouter()
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  const selectedCity = methods.watch('city_id')
  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })

  const [step, setStep] = useState(0)
  const [uploadState, setUploadState] = useState()

  const uploadMutation = useUploadFile({ fileType: FileTypeEnums.AVATAR })

  const registerMutation = useRegisterRealtor({
    onSuccess: () => {
      toast.success('ثبت‌نام با موفقیت انجام شد')
      router.replace(
        `https://admin.amline.ir/login?mobile=${`0${methods.getValues('mobile')}`.slice(-11)}`
      )
    },
    onError: handleErrorOnSubmit,
  })

  const handleNext = async () => {
    const ok = await methods.trigger(['mobile', 'national_code', 'birth_date'])
    if (ok) setStep(1)
  }

  const handlePrev = () => setStep(0)

  const handleSubmit = async (values) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    const payload = {
      mobile: `0${values.mobile}`.slice(-11),
      national_code: values.national_code,
      birth_date: values.birth_date,
      address: values.address,
      city_id: values.city_id,
      district_ids: Array.isArray(values.district_ids) ? values.district_ids : [],
      office_name: values.office_name,
      realtor_type: values.realtor_type,
      avatar_file_id: values.avatar_file_id?.[0]?.uploadResponse?.data?.id || 0,
    }

    registerMutation.mutate(payload)
  }

  return (
    <>
      <SEO title="ثبت‌نام مشاور املاک" noIndex />
      <HeaderNavigation backUrl={-1} title="ثبت نام پنل مشاور املاک">
        <Link href="/">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
        </Link>
      </HeaderNavigation>
      {/* <div className="flex items-center justify-center border-b border-[#E1E1E1] bg-white px-7 py-3">
        <Link href="/">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
        </Link>
      </div> */}

      <div className="p-7">
        <div className="p-4 bg-white rounded-2xl">
          <Form methods={methods} onSubmit={handleSubmit}>
            {step === 0 && (
              <>
                <InputField
                  isNumeric
                  type="tel"
                  label="کد ملی"
                  name="national_code"
                  maxLength={10}
                />

                <InputField
                  ltr
                  isNumeric
                  type="tel"
                  label="شماره تماس"
                  name="mobile"
                  suffix={<span dir="ltr">+98</span>}
                  maxLength={11}
                />

                <DatePickerField valueFormat="yyyy-MM-dd" name="birth_date" label="تاریخ تولد" />

                <BottomCTA>
                  <div className="flex gap-5">
                    <Button
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="w-full"
                    >
                      انصراف
                    </Button>
                    <Button
                      onClick={handleNext}
                      loading={registerMutation.isLoading}
                      className="w-full"
                    >
                      ثبت و ادامه
                    </Button>
                  </div>
                </BottomCTA>
              </>
            )}

            {step === 1 && (
              <>
                <ImageUploaderField
                  name="avatar_file_id"
                  label="عکس سلفی یا ۴*۳"
                  maxImageCount={1}
                  uploadFileType={FileTypeEnums.AVATAR}
                  onUploadStateChange={setUploadState}
                  uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
                />

                <InputField name="address" label="آدرس محل سکونت" />

                <SelectCityField asValue name="city_id" label="شهر محل فعالیت" />

                <SelectField
                  asValue
                  searchable
                  multiSelect
                  valueKey="id"
                  label="محله فعالیت"
                  labelKey="name"
                  name="district_ids"
                  disabled={!selectedCity}
                  options={districtOptionQuery.data}
                  loading={districtOptionQuery.isLoading}
                />

                <InputField name="office_name" label="نام بنگاه محل فعالیت" />

                <Field
                  name="realtor_type"
                  render={({ field, fieldState }) => (
                    <div>
                      <div className="mb-2">مشاور املاک</div>
                      <div className="flex gap-4">
                        <RadioButton
                          value="LICENSE_HOLDER"
                          checked={field.value === 'LICENSE_HOLDER'}
                          onChange={() => field.onChange('LICENSE_HOLDER')}
                          label="صاحب پروانه"
                        />

                        <RadioButton
                          value="INDEPENDENT_CONSULTANT"
                          checked={field.value === 'INDEPENDENT_CONSULTANT'}
                          onChange={() => field.onChange('INDEPENDENT_CONSULTANT')}
                          label="مشاور آزاد"
                        />

                        <RadioButton
                          value="EMPLOYED_AT_FIRM"
                          checked={field.value === 'EMPLOYED_AT_FIRM'}
                          onChange={() => field.onChange('EMPLOYED_AT_FIRM')}
                          label="مشغول در دفتر"
                        />
                      </div>

                      {fieldState?.error && (
                        <div className="text-xs mt-2 text-rust-600">{fieldState.error.message}</div>
                      )}
                    </div>
                  )}
                />

                <BottomCTA>
                  <div className="flex gap-5">
                    <Button variant="outline" onClick={handlePrev} className="w-full">
                      بازگشت
                    </Button>
                    <Button type="submit" loading={registerMutation.isPending} className="w-full">
                      ثبت نهایی
                    </Button>
                  </div>
                </BottomCTA>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  )
}
