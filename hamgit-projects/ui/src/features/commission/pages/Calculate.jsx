import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SegmentedControl from '@/components/ui/SegmentedControl'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { HeaderNavigation, PageFooter } from '@/features/app'
import house from '@/assets/images/house.svg'
import { Form, InputNumberField, SelectField, useForm } from '@/components/ui/Form'
import { handleErrorOnSubmit } from '@/utils/error'
import { commissionCalculateOptions, commissionCategoryEnum } from '../constants'
import WrapperCard from '../components/WrapperCard'
import useRentalCommission from '../api/rental-commission'
import useSaleCommission from '../api/sale-commission'
import InvoiceRow from '../components/InvoiceRow'
import Divider from '../components/Divider'

const questions = [
  {
    name: 'category',
    title: 'محاسبه کمیسیون قرارداد',
    options: commissionCalculateOptions,
  },
]

const places = [
  { label: 'تهران', value: 'TEHRAN' },
  { label: 'شهرستان', value: 'OTHERS' },
]

const defaultValues = {
  security_deposit_amount: '',
  rent_amount: '',
  sale_price: '',
  city: '',
}

export default function Calculate() {
  const [selectedOptions, setSelectedOptions] = useState({
    category: commissionCategoryEnum.RENTAL,
  })
  const [commissionData, setCommissionData] = useState(null)
  const [isShowResult, setIsShowResult] = useState(false)

  const isRental = selectedOptions.category === 1

  const methods = useForm({
    defaultValues,
  })

  const { mutate: rentalCommissionMutation, isPending: rentalCommissionLoading } =
    useRentalCommission()
  const { mutate: saleCommissionMutation, isPending: saleCommissionLoading } = useSaleCommission()

  const onSubmit = () => {
    const data = methods.getValues()

    const submissionData = {
      security_deposit_amount: isRental ? Number(data.security_deposit_amount) : undefined,
      rent_amount: isRental ? Number(data.rent_amount) : undefined,
      city: isRental ? undefined : data.city,
      sale_price: isRental ? undefined : Number(data.sale_price),
    }

    if (isRental)
      rentalCommissionMutation(submissionData, {
        onSuccess: (_data) => {
          setCommissionData(_data.data)
          setIsShowResult(true)
        },
        onError: handleErrorOnSubmit,
      })
    else
      saleCommissionMutation(submissionData, {
        onSuccess: (_data) => {
          setCommissionData(_data.data)
          setIsShowResult(true)
        },
        onError: handleErrorOnSubmit,
      })
  }

  const initializer = () => {
    methods.reset()
    setIsShowResult(false)
    setCommissionData(null)
  }
  const commissionAmount = commissionData?.commission || 0

  const NoPayment = isRental ? commissionAmount - 290000 : commissionAmount * 0.6
  return (
    <>
      <HeaderNavigation
        title="محاسبه کمیسیون املاک"
        description="با وارد کردن مبلغ اجاره یا فروش از حق کمیسیون قانونی و دقیقِ طرفین معامله به‌طور سریع و آنلاین باخبر شوید."
        backUrl="/"
      />

      <div className="mt-16">
        <Image className="mx-auto" width={162} height={152} src={house} alt="house" />

        <div className="px-4 py-6 my-auto grid gap-5">
          <div className="flex flex-col gap-8">
            {questions.map((question) => (
              <div key={question.name} className="flex flex-col gap-3 text-center">
                <label className="font-bold" htmlFor={question.name}>
                  {question.title}
                </label>
                <SegmentedControl
                  name={question.name}
                  segments={question.options}
                  value={question.options.find((o) => o.value === selectedOptions[question.name])}
                  onChange={(val) => {
                    setSelectedOptions((state) => ({ ...state, [question.name]: val.value }))
                    initializer()
                  }}
                />
              </div>
            ))}
          </div>
          <WrapperCard>
            <Form methods={methods} onSubmit={onSubmit}>
              {isRental ? (
                <>
                  <InputNumberField
                    required
                    ltr
                    suffix="تومان"
                    decimalSeparator="/"
                    name="security_deposit_amount"
                    label={`مبلغ قرض الحسنه (رهن) `}
                    placeholder="مبلغ ودیعه"
                  />
                  <InputNumberField
                    ltr
                    required
                    suffix="تومان"
                    decimalSeparator="/"
                    name="rent_amount"
                    label="مبلغ اجاره "
                    placeholder="مبلغ اجاره"
                  />
                </>
              ) : (
                <>
                  <InputNumberField
                    ltr
                    required
                    suffix="تومان"
                    decimalSeparator="/"
                    name="sale_price"
                    label="مبلغ فروش"
                    placeholder="مبلغ فروش"
                  />
                  <SelectField required asValue label="واقع شده در" name="city" options={places} />
                </>
              )}
              <Button
                type="submit"
                className="w-full"
                loading={isRental ? rentalCommissionLoading : saleCommissionLoading}
              >
                محاسبه کمیسیون
              </Button>
            </Form>
            {isShowResult && (
              <Alert variant="info" className="mt-4">
                <div className="flex flex-col gap-2">
                  {/* <SigningDocument /> */}
                  <InvoiceRow
                    price={commissionData?.commission}
                    title="کمیسیون مصوب هر یک از طرفین قرارداد"
                  />
                  <InvoiceRow price={NoPayment} title="تخفیف املاین برای این قرارداد" isDiscount />
                  <Divider />
                  <InvoiceRow
                    price={commissionData?.commission}
                    title="کمیسون قابل پرداخت شما با"
                    isLast
                    buyingOption={isRental ? 'rental' : 'sale'}
                  />
                </div>
              </Alert>
            )}
          </WrapperCard>
        </div>
      </div>

      <PageFooter descriptionTitle="محاسبۀ کمیسیون قرارداد">
        در این صفحه اگر ملکی رو بخوای اجاره بکنی یا اجاره بدی، مبلغ رهن و اجاره رو وارد می‌کنی و
        سیستم به‌طور خودکار کمیسیون قانونی و واقعی رو محاسبه می‌کنه. همچنین اگر بخوای خونه بخری یا
        بفروشی، مبلغ ملک و این که در تهران یا در شهرستان واقع شده رو می‌زنی و قیمت کمیسیون رو برات
        می‌نویسه. این‌طوری از قیمت واقعی کمیسیون قرارداد اطلاع داری و نه مبلغ اضافی پرداخت می‌کنی و
        نه اجازه میدی که سوءاستفاده‌گران فریبت بدن.
        <br />
        حالا که از حق کمیسیون قیمت خونه‌ات مطلع شدی، به صفحۀ «
        <Link href="/contracts/new" className="text-blue-600">
          انعقاد قرارداد
        </Link>
        » برو و به صورت آنلاین قرارداد ببند.
      </PageFooter>
    </>
  )
}
