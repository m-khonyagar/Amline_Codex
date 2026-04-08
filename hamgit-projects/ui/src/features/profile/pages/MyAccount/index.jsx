import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { DatePickerField, Form, InputField, SelectField } from '@/components/ui/Form'
import usePatchCurrentUser from '../../api/patch-current-user'
import { handleErrorOnSubmit } from '@/utils/error'
import { useAuthContext } from '@/features/auth'
import AvatarUploader from '../../components/AvatarUploader'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { GenderEnumsOptions } from '@/data/enums/gender_enums'
import { pickWithDefaults } from '@/utils/object'

const defaultValues = {
  first_name: '',
  last_name: '',
  gender: null,
  nick_name: '',
  birth_date: '',
  national_code: '',
  mobile: '',
  phone: '',
  avatar_file_id: null,
  postal_code: '',
  email: '',
  address: '',
  father_name: '',
}

function MyAccount() {
  const { currentUser, currentUserQuery } = useAuthContext()
  const { mutate: updateProfile, isPending } = usePatchCurrentUser()
  const router = useRouter()

  const [uploadState, setUploadState] = useState()

  const methods = useForm({
    values: pickWithDefaults(currentUser, defaultValues),
  })

  const onSubmitEditUserData = (data) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری فایل ناموفق بوده است.')
      return
    }

    updateProfile(
      {
        ...data,
        birth_date: data.birth_date || null,
      },
      {
        onSuccess: () => {
          router.push('/profile')
        },
        onError: (err) => {
          handleErrorOnSubmit(err, methods.setError)
        },
      }
    )
  }

  const avatar = useMemo(() => {
    // prettier-ignore
    return currentUser?.avatar_file
      ? {
        url: currentUser?.avatar_file.url,
        id: currentUser?.avatar_file.id,
      }
      : null
  }, [currentUser])

  return (
    <div>
      <HeaderNavigation title="حساب من" />

      <div className="px-8 py-6">
        <LoadingAndRetry query={currentUserQuery}>
          {!!currentUser && (
            <Form methods={methods} onSubmit={onSubmitEditUserData}>
              <AvatarUploader
                onDone={(id) => methods.setValue('avatar_file_id', id)}
                onUploadStateChange={setUploadState}
                avatar={avatar}
                withCrop
              />
              <InputField
                name="first_name"
                label="نام"
                placeholder="محمد یاسر"
                readOnly={currentUser?.is_verified}
              />
              <InputField
                name="last_name"
                label="نام خانوادگی"
                placeholder="اکبری"
                readOnly={currentUser?.is_verified}
              />
              <SelectField
                asValue
                name="gender"
                label="جنسیت"
                placeholder="مرد"
                options={GenderEnumsOptions}
              />
              <InputField
                name="nick_name"
                label="نام مستعار"
                placeholder="رضا محسنی"
                className="mb-3"
                helperText="* برای حفظ حریم شخصی خود می توانید با نام مستعار آگهی منتشر کنید ."
              />
              <DatePickerField
                name="birth_date"
                valueFormat="yyyy-MM-dd"
                label="تاریخ تولد"
                placeholder="1370/12/09"
                readOnly={currentUser?.is_verified}
              />
              <InputField
                name="national_code"
                label="کد ملی"
                placeholder="0371425369"
                readOnly={currentUser?.is_verified}
              />
              <InputField name="email" label="ایمیل" placeholder="example@gmail.com" />
              <InputField name="mobile" label="شماره همراه" placeholder="09123456789" readOnly />
              <InputField name="phone" label="شماره ثابت" placeholder="02536654896" />
              <InputField name="postal_code" label="کد پستی" placeholder="0123456789" />
              <InputField
                name="address"
                label="آدرس"
                multiline
                placeholder="تهران، شهرری، میدان شهدای شاملو، خیابان فرمانداری، کوچه 14، پلاک 32، طبقه سوم، واحد 5"
              />

              <BottomCTA>
                <Button className="w-full" type="submit" loading={isPending}>
                  ثبت
                </Button>
              </BottomCTA>
            </Form>
          )}
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default MyAccount
