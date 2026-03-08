import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import DrawerModal from '@/components/ui/DrawerModal'
import Modal from '@/components/ui/Modal'
import { useGuideContext } from '../providers/GuideProvider'
import Button from '@/components/ui/Button'
import { ChatIcon, PhoneIcon } from '@/components/icons'
import helpDeskImg from '@/assets/images/help_desk.svg'
import signContractImg from '@/assets/images/sign_contract.svg'
// import calculatorImg from '@/assets/images/calculator.svg'
// import bubbleQuestionImg from '@/assets/images/bubble_question.svg'
import support from '@/assets/images/support_modal.svg'
import { supportPhones } from '@/features/home'

export default function GuideDrawer() {
  const router = useRouter()
  const { isOpen, setIsOpen, isSupportModalOpen, setIsSupportModalOpen } = useGuideContext()

  const closeDrawer = () => setIsOpen(false)
  const closeModal = () => setIsSupportModalOpen(false)

  const drawerActions = [
    {
      id: 1,
      text: 'پشتیبانی',
      imgSrc: helpDeskImg.src,
      alt: 'پشتیبانی',
      action: () => setIsSupportModalOpen(true),
    },
    {
      id: 2,
      text: 'راهنمای انعقاد قرارداد',
      imgSrc: signContractImg.src,
      alt: 'راهنمای انعقاد قرارداد',
      action: () => router.push('/guide/contract'),
    },
    // {
    //   id: 3,
    //   text: 'راهنمای محاسبه کمیسیون',
    //   imgSrc: calculatorImg.src,
    //   alt: 'راهنمای محاسبه کمیسیون',
    //   action: () => undefined,
    // },
    // {
    //   id: 4,
    //   text: 'راهنمای ثبت نیازمندی',
    //   imgSrc: bubbleQuestionImg.src,
    //   alt: 'راهنمای ثبت نیازمندی',
    //   action: () => undefined,
    // },
  ]

  return (
    <>
      <Modal open={isSupportModalOpen} onClose={closeModal}>
        <div className="py-4 w-[320px] flex flex-col items-center gap-5">
          <Image src={support.src} width={100} height={100} alt="support" />

          <h6 className="text-lg font-medium text-gray-950">به پشتیبانی املاین نیاز دارید؟</h6>

          <p className="text-center text-gray-900">
            تیم پشتیبانی از ساعت 9 الی 21 آماده پاسخگویی به شما می باشد
          </p>

          <div className="w-full flex items-center gap-3">
            <Button
              href={`tel:${supportPhones[0].value}`}
              className="w-full text-teal-600"
              variant="text"
            >
              <PhoneIcon size={20} className="ml-2" />
              تماس با پشتیبانی
            </Button>

            <Button
              className="w-full"
              onClick={() => {
                closeModal()
                // eslint-disable-next-line no-undef
                if (typeof Goftino !== 'undefined') Goftino.open()
              }}
            >
              <ChatIcon size={20} className="ml-2" />
              چت با پشتیبانی
            </Button>
          </div>
        </div>
      </Modal>

      <DrawerModal show={isOpen} modalHeader="سوال" handleClose={closeDrawer}>
        <ul className="flex flex-col max-w-2xl w-full mx-auto items-stretch gap-3 pt-4">
          {drawerActions.map((item) => (
            <li key={item.id}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  closeDrawer()
                  item.action()
                }}
              >
                <Image width={35} height={35} src={item.imgSrc} className="ml-2" alt={item.alt} />
                {item.text}
              </Button>
            </li>
          ))}
        </ul>
      </DrawerModal>
    </>
  )
}
