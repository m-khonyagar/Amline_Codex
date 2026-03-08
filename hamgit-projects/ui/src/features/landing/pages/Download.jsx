import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'

function DownloadAppPage() {
  return (
    <>
      <HeaderNavigation title="دانلود اپلیکیشن" />

      <div className="px-6 mt-36 flex flex-col text-justify">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-5">
            <Image
              src="/images/logotype.svg"
              alt="logo"
              width={200}
              height={80}
              className="max-w-full mx-auto mb-2.5"
            />
            <p>دانلود اپلیکیشن املاین</p>
          </div>

          <a
            href="https://amline-public.storage.iran.liara.space/amline_v.0.1.apk"
            download="amline"
            id="direct-download-app"
          >
            <Image
              src="/images/direct-download-badge.png"
              width={200}
              height={60}
              alt="direct-download"
            />
          </a>
        </div>
      </div>
    </>
  )
}

export default DownloadAppPage
