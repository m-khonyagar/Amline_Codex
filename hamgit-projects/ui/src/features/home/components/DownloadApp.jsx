import { useMemo, useState } from 'react'
import Image from 'next/image'
import Modal from '@/components/ui/Modal'
import { cn } from '@/utils/dom'
import { downloadAppLinks } from '../constants'
import { isWebView } from '@/utils/webview'
import { useAuthContext } from '@/features/auth'
import { IosShareIcon } from '@/components/icons'
import bazzarImg from '@/assets/images/landing/app-bazaar.png'
import myketImg from '@/assets/images/landing/app-myket.png'
import iosImg from '@/assets/images/landing/app-ios.png'
import addHomeScreen from '@/assets/images/landing/add-home-screen.png'

function DownloadApp({ className }) {
  const { initialLoading } = useAuthContext()
  const isWebView_ = useMemo(() => !initialLoading && isWebView(), [initialLoading])
  const [isModalOpen, setIsModalOpen] = useState(false)

  return !isWebView_ ? (
    <div className={cn('flex flex-col items-center p-10 bg-[#6B8EB8]', className)} id="download">
      <h5 className="text-white text-lg font-bold">جای شما تو املاین خالیه!</h5>

      <div className="flex mt-7">
        <div className="relative pb-3 pr-4 pt-24 mx-auto isolate">
          <div className="bg-[#183D68] absolute rounded-xl top-0 bottom-0 right-0 w-[106px] text-white text-center -z-10">
            <div className="font-black mt-6">دانلود</div>
            <div className="text-sm">اپلیکیشن املاین</div>
          </div>

          <a className="block" href={downloadAppLinks.BAZAAR} target="_blank" rel="noreferrer">
            <Image width={188} height={62} alt="bazaar" src={bazzarImg.src} />
          </a>

          <a className="block mt-2" href={downloadAppLinks.MYKET} target="_blank" rel="noreferrer">
            <Image width={208} height={62} alt="myket" src={myketImg.src} />
          </a>

          <button type="button" className="mt-2" onClick={() => setIsModalOpen(true)}>
            <Image width={230} height={62} alt="ios" src={iosImg.src} />
          </button>
        </div>
      </div>

      <Modal className="!bg-[#E0FAFA]" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="pb-4 w-[312px] flex flex-col items-center">
          <Image src="/images/logotype.svg" width={85} height={35} alt="support" />

          <ul className="fa mt-12 flex flex-col gap-4 text-center">
            <li className="flex items-center justify-center gap-0.5">
              1: در نوار پایین گوشی دکمه
              <IosShareIcon size={20} color="#2A79FF" className="mb-1" />
              را کلیک کنید.
            </li>

            <li className="flex flex-col items-center gap-0.5">
              2: منو باز شده را به بالا اسکرول کنید و دکمه
              <Image src={addHomeScreen.src} width={180} height={27} alt="logo" />
              را کلیک کنید.
            </li>

            <li>3:در آخر در بالای صفحه دکمه Add را کلیک کنید.</li>

            <li>4: در صورتی که سیستم عامل شما ios است، از مرورگر سافاری استفاده کنید.</li>
          </ul>
        </div>
      </Modal>
    </div>
  ) : null
}

export default DownloadApp
