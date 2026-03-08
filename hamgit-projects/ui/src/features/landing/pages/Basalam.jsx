import Image from 'next/image'
import getConfig from 'next/config'
import basalamLogoImg from '@/assets/images/landing/basalam-logo.png'
import logoImg from '@/assets/images/landing/logo.svg'
import myketImg from '@/assets/images/landing/myket.png'
import exclamationMarkImg from '@/assets/images/landing/exclamation-mark.svg'
import { supportPhones } from '@/features/home'
import callIcon from '@/assets/images/landing/contract-guarantee/call-icon.svg'
import { downloadAppLinks } from '../../home/constants'

export default function BasalamPage() {
  const { publicRuntimeConfig } = getConfig()

  return (
    <div className="px-6">
      <div className="py-6">
        <div className="text-center mb-6">
          <div className="flex gap-6 justify-center mb-10">
            <Image src={basalamLogoImg.src} width={90} height={140} alt="" />
            <Image src={logoImg.src} width={96} height={140} alt="" />
          </div>
          <h2 className="font-bold text-[16px]">
            باسلام و املاین (املاک آنلاین) در کنار باسلامی‌ها
          </h2>
          <p className="text-sm text-[#878787]">
            با تفاهمی که بین شرکت های باسلام و املاین انجام شده، املاین امکان انعقاد قرارداد آنلاین
            رو در زمینه املاک فراهم کرده و اهالی باسلام می‍‌‍‍‍‍‌‍‍تونن از خدمات املاین با تخفیف
            ویژه استفاده کنند.
          </p>
        </div>

        <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] px-4 py-3 mb-[50px] text-[11px]">
          <p>
            اگر قصد دارین با با مستاجرتون قرارداد ببندین یا اینکه ملکی دارین که می‌خواین بفروشین،
            می‌تونین با استفاده از کدهای تخفیف
            <strong> 600 هزار تومانی </strong>
            که برای اهالی باسلام ارسال شده، قراردادتون رو آنلاین یا حضوری ببندین و نسخه فیزیکی
            قراردادتون رو دم در خونه تون تحویل بگیرین!
            <br />
            حتی اگر دنبال رهن و اجاره املاک هم هستین، می‌تونین ویژگی‌های ملک مورد نظرتون رو به
            املاین بگین تا املاین، ملکی که مد نظر دارین رو براتون پیدا کنه و دو طرف قرارداد رو به هم
            دیگه مرتبط کنه…
          </p>
        </div>

        <div className="text-center mb-3">
          <h3 className="font-bold text-[16px] mb-2.5">
            همین الان املاین رو دانلود کن
            <br />و از تخفیف 600 هزار تومانی که بهت داده لذت ببر
          </h3>
          <a href={downloadAppLinks.MYKET} rel="nofollow">
            <Image src={myketImg.src} width={122} height={40} alt="myket" className="mx-auto" />
          </a>
        </div>

        <div className="-mx-6 px-10 py-4 bg-white relative mb-3">
          <Image
            src={exclamationMarkImg.src}
            width={6}
            height={21}
            alt=""
            className="absolute right-6"
          />
          <p>
            راستی اگه خواستین حضوری هم قرارداد ببندین، فعلا در قم می تونین به شعبات املاین مراجعه
            کنین و با ارائه کد تخفیف، از خدمات املاین بهرمند بشین.
          </p>
        </div>

        <div className="mb-12">
          <p className="text-sm font-extrabold text-center mb-3">
            اگر نیاز به اطلاعات بیشتری دارید، از راه های زیر با ما در ارتباط باشید:
          </p>
          <div className="flex gap-1 justify-center text-sm fa flex-wrap">
            {supportPhones.map((phone) => (
              <a
                key={phone.value}
                href={`tel:${phone.value}`}
                className="bg-white border border-primary rounded-[12px] font-bold pl-5 pr-11 relative p-3"
              >
                <Image
                  src={callIcon.src}
                  alt=""
                  className="absolute right-2 top-2.5"
                  width={19}
                  height={20}
                />
                <span>{phone.text}</span>
              </a>
            ))}
            <a
              href={publicRuntimeConfig.BASE_URL}
              className="bg-white border border-primary rounded-[12px] font-bold px-11 relative p-3"
            >
              سایت املاین
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
