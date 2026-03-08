import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'

import { CheckboxField, Form, InputField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { mobileNumberSchema } from '@/utils/schema'
import userSignInImg from '@/assets/images/user_sign_in.svg'

const formSchema = z.object({
  mobile: mobileNumberSchema,
  isAcceptedTerms: z.coerce.boolean().pipe(z.literal(true)),
})

function AuthFormMobileStep({ mobile, acceptedTerms, onNext, isLoading }) {
  const methods = useForm({
    defaultValues: { mobile: mobile || '', isAcceptedTerms: acceptedTerms },
    // mode: 'onBlur',
    resolver: zodResolver(formSchema),
  })

  const { isValid } = methods.formState

  return (
    <div className="pt-4">
      <Image className="mx-auto" width={63} height={84} src={userSignInImg.src} alt="login" />

      <h1 className="mt-10 mb-0 text-center">ثبت نام / ورود</h1>

      <Form methods={methods} className="mt-5 fa" onSubmit={(data) => onNext(data, methods)}>
        <InputField
          ltr
          isNumeric
          type="tel"
          name="mobile"
          disabled={isLoading}
          inputClassName="!py-4"
          placeholder="شماره همراه"
          suffix={<span dir="ltr">+98</span>}
        />

        <CheckboxField
          name="isAcceptedTerms"
          label={
            <span>
              با{' '}
              <Link href="/terms" target="_blank" className="text-teal-600">
                قوانین و مقررات
              </Link>{' '}
              املاین موافقم.
            </span>
          }
        />

        <Button type="submit" disabled={!isValid} className="mt-8 w-full" loading={isLoading}>
          ورود
        </Button>
      </Form>
    </div>
  )
}

export default AuthFormMobileStep
