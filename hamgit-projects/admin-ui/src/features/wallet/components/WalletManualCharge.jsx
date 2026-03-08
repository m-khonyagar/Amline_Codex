import { Form, InputField, InputNumberField, useForm, useFormValues } from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { numberSeparator } from '@/utils/number'
import { useWalletManualCharge } from '../api/manual-charge'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'
import { CloseIcon, InfoIcon, MinusIcon, PlusIcon } from '@/components/icons'
import { useMemo } from 'react'
import { useGetUserInfo } from '@/features/user'

const replacements = {
  '{amount}': 'مبلغ شارژ شده',
  '{credit}': 'موجودی کیف پول',
}

const WalletManualCharge = ({ className, onCancel, onSuccess, userId }) => {
  const userInfoQuery = useGetUserInfo(userId)

  const methods = useForm({
    defaultValues: {
      mobile: '',
      amount: '',
      text_message: '',
    },
    values: {
      mobile: userInfoQuery?.data?.mobile || '',
    },
  })

  const manualChargeMutation = useWalletManualCharge()

  const values = useFormValues(methods)

  const isNegative = useMemo(() => {
    return values.amount < 0
  }, [values])

  const handleSubmit = (data) => {
    const _data = {
      ...data,
      text_message: data?.text_message ? data.text_message : undefined,
    }

    manualChargeMutation.mutate(_data, {
      onSuccess: (res) => {
        toast.success('شارژ اعتبار انجام شد.', {
          description: `اعتبار کاربر ${numberSeparator(res.data.credit)} تومان می‌باشد`,
        })

        methods.reset()
        onSuccess?.(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.info(`"${text}" کپی شد`)
  }

  return (
    <div className={cn(className)}>
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="p-4 bg-teal-100 rounded-lg text-sm flex gap-2 text-teal-700">
          <InfoIcon />
          <span>
            در صورتی که می‌خواهید اعتبار کاربر را کاهش دهید، عدد را به صورت <strong>منفی</strong>{' '}
            وارد کنید.
          </span>
        </div>

        <InputField
          ltr
          required
          isNumeric
          type="tel"
          name="mobile"
          label="موبایل"
          disabled={!!userId}
          readOnly={!!userId}
          suffix={<span dir="ltr">+98</span>}
        />

        <InputNumberField allowNegative required label="مبلغ (تومان)" name="amount" />

        <InputField multiline name="text_message" label="متن پیام" />

        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-2">علائم قابل استفاده:</p>
          <ul className="flex items-center flex-wrap gap-x-6 gap-y-1">
            {Object.entries(replacements).map(([key, description]) => (
              <li
                key={key}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => handleCopyToClipboard(key)}
              >
                {key}: {description}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-left">
          {onCancel && (
            <Button
              size="sm"
              variant="gray"
              onClick={onCancel}
              disabled={manualChargeMutation.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>
          )}

          <Button
            size="sm"
            type="submit"
            className={cn('mr-2', { 'bg-red-500': isNegative })}
            loading={manualChargeMutation.isPending}
          >
            {isNegative ? (
              <>
                <MinusIcon size={14} className="ml-1" />
                کاهش اعتبار
              </>
            ) : (
              <>
                <PlusIcon size={14} className="ml-1" />
                شارژ اعتبار
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default WalletManualCharge
