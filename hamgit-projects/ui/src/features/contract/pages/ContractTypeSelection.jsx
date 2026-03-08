import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { BottomCTA, HeaderNavigation, PageFooter } from '@/features/app'
import SegmentedControl from '@/components/ui/SegmentedControl'
import {
  contractTypeEnumOptions,
  prContractPartyTypeEnum,
  prContractPartyTypeOptions,
  contractTypeEnum,
} from '../constants'
import useCreateContract from '../api/create-contract'
import { handleErrorOnSubmit } from '@/utils/error'
import signContractImg from '@/assets/images/sign_contract.svg'

const questions = [
  {
    name: 'contractType',
    title: 'چه قراردادی میخوای ببندی؟',
    options: contractTypeEnumOptions,
  },
  {
    name: 'creatorType',
    title: 'مالک هستی یا مستاجر؟',
    options: prContractPartyTypeOptions,
  },
  // {
  //   name: 'isGuaranteed',
  //   title: 'میخوای قراردادت رو ضمانت کنی؟',
  //   options: [
  //     {
  //       value: 0,
  //       label: 'خیر',
  //     },
  //     {
  //       value: 1,
  //       label: 'بله',
  //     },
  //   ],
  // },
]

function ContractTypeSelectionPage() {
  const router = useRouter()
  const [selectedOptions, setSelectedOptions] = useState({
    contractType: contractTypeEnum.PROPERTY_RENT,
    creatorType: prContractPartyTypeEnum.LANDLORD,
    isGuaranteed: 0,
  })

  const createContract = useCreateContract()

  const handleSubmit = () => {
    createContract.mutate(
      {
        contract_type: selectedOptions.contractType,
        party_type: selectedOptions.creatorType,
        is_guaranteed: !!selectedOptions.isGuaranteed,
      },
      {
        onSuccess: (res) => {
          router.replace(`/contracts/${res.data.id}/manage`)
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  return (
    <>
      <HeaderNavigation title="ایجاد قرارداد" backUrl="/contract" />

      <div className="px-4 py-6">
        <div className="mb-6">
          <Image
            src={signContractImg.src}
            alt=""
            width={160}
            height={130}
            className="mx-auto my-2"
          />
        </div>
        <div className="flex flex-col gap-8">
          {questions.map((question) => (
            <div key={question.name} className="flex flex-col gap-3 text-center">
              <label htmlFor={question.name}>{question.title}</label>
              <SegmentedControl
                name={question.name}
                segments={question.options}
                value={question.options.find((o) => o.value === selectedOptions[question.name])}
                onChange={(val) =>
                  setSelectedOptions((state) => ({ ...state, [question.name]: val.value }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <BottomCTA>
        <Button className="w-full" onClick={handleSubmit} loading={createContract.isPending}>
          تایید
        </Button>
      </BottomCTA>

      <PageFooter descriptionTitle="انعقاد قرارداد">
        <p>
          در املاین همۀ قراردادهای املاک خود را به‌صورت آنلاین و بدون هیچ‌گونه مراجعۀ حضوری بنویسید.
          در صفحۀ انعقاد قرارداد، هم امکان ایجاد قرارداد «رهن و اجاره» و هم «خرید و فروش» وجود دارد.
          شما چه این که مالک باشید و چه مستاجر در سایت یا نرم‌افزار باید وارد قسمت انعقاد قرارداد
          شده و اطلاعات خود را وارد کنید. همچنین امکان نوشتن قرارداد از طرف شخص حقوقی (اعم از
          سازمان‌ها، شرکت‌ها، مؤسسات و…) نیز وجود دارد. پس از این که هر یک از طرفین، اطلاعات و
          مشخصات خود (به‌عنوان مالک یا مستاجر و…) را تکمیل کرده و بندهای قرارداد مورد توافق طرفین
          بود، کدی برای هر طرف پیامک می‌شود که طرفین باید در حساب (پنل) شخصی خود (پس از تکمیل
          اطلاعات) آن را وارد کنند. از این طریق به‌صورت الکترونیکی قرارداد را امضا و تایید کرده و
          کار نهایی می‌شود. در نهایت فایل قرارداد در دسترس طرفین خواهد بود.
          <br />
          اگه می‌خوای هزینه انعقاد قراردادت رو بدونی به صفحۀ «
          <Link href="/commission/calculate" className="text-blue-600">
            محاسبه کمیسیون
          </Link>
          » یه سری بزن و از حق کمیسیون قانونی خودت مطلع شو.
        </p>
      </PageFooter>
    </>
  )
}

export default ContractTypeSelectionPage
