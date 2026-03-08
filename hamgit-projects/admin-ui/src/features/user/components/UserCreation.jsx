import { useEffect } from 'react'
import { z } from 'zod'
import { useGetUserInfo } from '../api/get-user-info'
import useUpsertUser from '../api/upsert-user'
import { useAuthContext } from '@/features/auth'
import { userRoles, userRolesTranslation } from '@/data/enums/user-enums'
import {
  CheckboxField,
  DatePickerField,
  Form,
  InputField,
  SelectField,
  useForm,
} from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { handleErrorOnSubmit } from '@/utils/error'
import { convertEmptyStringsToNull, pickWithDefaults } from '@/utils/object'
import { zodResolver } from '@hookform/resolvers/zod'
import { mobileNumberSchema } from '@/utils/schema'
import { useDebounce } from '@/hooks/use-debounce'
import { useGetUserExistence } from '../api/user-existence'
import { useGetFileLabels } from '@/features/market'

import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'

const formSchema = z
  .object({
    mobile: mobileNumberSchema,
    first_name: z.string(),
    last_name: z.string(),
    father_name: z.string(),
    national_code: z.string(),
    address: z.string(),
    postal_code: z.string(),
    birth_date: z.string(),
    roles: z.array(z.enum(userRoles)),
    is_verified: z.boolean(),
    verify_identity: z.boolean(),
    label_ids: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.verify_identity) {
      if (!data.national_code) {
        ctx.addIssue({
          path: ['national_code'],
          code: z.ZodIssueCode.custom,
          message: 'کد ملی الزامی است.',
        })
      }
      if (!data.birth_date) {
        ctx.addIssue({
          path: ['birth_date'],
          code: z.ZodIssueCode.custom,
          message: 'تاریخ تولد الزامی است.',
        })
      }
    }
  })

const defaultValues = {
  mobile: '',
  first_name: '',
  last_name: '',
  father_name: '',
  national_code: '',
  address: '',
  postal_code: '',
  birth_date: '',
  roles: ['PERSON'],
  is_verified: false,
  verify_identity: false,
  label_ids: [],
}

const ALLOWED_ASSIGNS = {
  SUPERUSER: [
    'STAFF',
    'AD_MODERATOR',
    'CONTRACT_ADMIN',
    'AUDITOR',
    'EMPTY_CONTRACT_CREATOR',
    'SUPERUSER',
  ],
  STAFF: ['CONTRACT_ADMIN'],
}

const UserCreation = ({ userId, onCancel, onSuccess }) => {
  const { currentUser } = useAuthContext()
  const getUserQuery = useGetUserInfo(userId, { enabled: !!userId })

  const currentUserRoles = currentUser?.roles || []

  const user = userId && getUserQuery.data

  const methods = useForm({
    resolver: zodResolver(formSchema),
    values: pickWithDefaults({ ...user }, defaultValues),
  })

  const debouncedValue = useDebounce(methods.watch('mobile'), 800)

  const userExistenceQuery = useGetUserExistence(debouncedValue, { enabled: !userId })
  const upsertUserMutation = useUpsertUser()

  const { data: fileLabels = [] } = useGetFileLabels('USER')
  const fileLabelOptions = fileLabels.map((label) => ({
    label: label.title,
    value: String(label.id),
  }))

  useEffect(() => {
    if (userExistenceQuery.error?.response?.status === 409) {
      methods.setError('mobile', {
        type: 'manual',
        message: 'کاربر با این شماره موبایل قبلا ثبت شده است',
      })
    } else methods.clearErrors('mobile')
  }, [userExistenceQuery.error, methods])

  const handleSubmit = (data, { setError }) => {
    upsertUserMutation.mutate(convertEmptyStringsToNull(data), {
      onSuccess: (res) => {
        toast.success(`کاربر با موفقیت ${userId ? 'ویرایش' : 'ایجاد'} شد`)

        onSuccess?.(res.data)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  const assignableRoles = [
    ...new Set(currentUserRoles.flatMap((role) => ALLOWED_ASSIGNS[role] || [])),
  ]

  return (
    <div className="bg-white rounded-lg p-4">
      <LoadingAndRetry query={userId ? getUserQuery : {}}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <InputField name="first_name" label="نام" />

            <InputField name="last_name" label="نام خانوادگی" />

            <InputField name="father_name" label="نام پدر" />

            <InputField
              required
              ltr
              readOnly={!!userId}
              isNumeric
              name="mobile"
              label="موبایل"
              suffix={<span className="mt-0.5">+98</span>}
            />

            <InputField ltr isNumeric name="national_code" label="کد ملی" />

            <DatePickerField name="birth_date" label="تاریخ تولد" />

            <SelectField
              asValue
              required
              name="roles"
              label="نقش"
              multiSelect
              options={[
                { value: 'PERSON', label: userRolesTranslation.PERSON },
                ...Object.entries(userRolesTranslation)
                  .filter(([key]) => assignableRoles.includes(key))
                  .map(([value, label]) => ({ value, label })),
              ]}
            />

            <InputField ltr isNumeric type="tel" name="postal_code" label="کد پستی" />

            <SelectField
              asValue
              multiSelect
              label="برچسب ها"
              name="label_ids"
              options={fileLabelOptions}
            />

            <InputField name="address" label="آدرس" multiline />

            <div className="col-span-full">
              <CheckboxField name="is_verified" label="احراز هویت" />
              <CheckboxField name="verify_identity" label="احراز هویت با فینوتک" />
            </div>
          </div>

          <div className="mt-4 text-left">
            {onCancel && (
              <Button
                size="sm"
                variant="gray"
                onClick={onCancel}
                disabled={upsertUserMutation.isPending}
              >
                <CloseIcon size={14} className="ml-1" /> انصراف
              </Button>
            )}
            <Button
              size="sm"
              type="submit"
              className="mr-2"
              disabled={userExistenceQuery.isLoading || userExistenceQuery.isError}
              loading={upsertUserMutation.isPending}
            >
              {userId ? (
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

export default UserCreation
