import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/dom'
import TrustItems from './TrustItems'
import { socialMediaLinks, supportPhones } from '../constants'
import CollapseBox from '@/components/ui/CollapseBox'
import InstagramIcon from '@/components/icons/InstagramIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import Phone2Icon from '@/components/icons/Phone2Icon'
import ShowMore from '@/components/ui/ShowMore'

function OldFooter({ className, showTrust = true }) {
  return (
    <footer className={cn('mx-4 pt-7 flex flex-col gap-6 fa border-t', className)}>
      <div>
        <Image src="/images/logotype.svg" alt="logo" width={83} height={32} className="" />

        <div className="text-gray-700 text-sm mt-4">
          تلفن پشتیبانی:
          <span>
            {supportPhones.map((phone) => (
              <a
                dir="ltr"
                key={phone.value}
                href={`tel:${phone.value}`}
                className="px-3 border-l last:border-0 border-gray-500"
              >
                {phone.text}
              </a>
            ))}
          </span>
        </div>
      </div>

      {showTrust && <TrustItems />}

      <div>
        <CollapseBox label="خدمات مشتریان" className="py-2 text-sm">
          <div className="flex flex-col gap-3 items-start pt-2">
            <button
              type="button"
              className="text-gray-700 hover:text-teal-700"
              // eslint-disable-next-line no-undef
              onClick={() => (typeof Goftino !== 'undefined' ? Goftino.open() : null)}
            >
              ارتباط با پشتیبانی
            </button>
            <Link href="/about-us" className="text-gray-700 hover:text-teal-700">
              درباره ما
            </Link>
          </div>
        </CollapseBox>

        <CollapseBox label="راهنمای املاین" className="border-t py-2 text-sm">
          <div className="flex flex-col gap-3 items-start pt-2">
            <Link href="/commission/calculate" className="text-gray-700 hover:text-teal-700">
              نحوه محاسبه کمیسیون
            </Link>
            <Link href="/landing/phone-tracking-code" className="text-gray-700 hover:text-teal-700">
              روند دریافت کد رهگیری
            </Link>
            <Link href="/landing/contract-guarantee" className="text-gray-700 hover:text-teal-700">
              ضمانت قرارداد چیست؟
            </Link>
          </div>
        </CollapseBox>

        <CollapseBox label="همراه ما باشید" className="border-t py-2 text-sm border-b">
          <div className="flex flex-col gap-3 items-start pt-2">
            <a
              href={socialMediaLinks.INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex text-gray-700 hover:text-teal-700 gap-2"
            >
              <InstagramIcon size={20} />
              اینستاگرام
            </a>

            <a
              href={socialMediaLinks.TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex text-gray-700 hover:text-teal-700 gap-2"
            >
              <TelegramIcon size={20} />
              تلگرام
            </a>

            <div className="flex gap-2 text-gray-700">
              <Phone2Icon size={20} />
              {supportPhones.map((phone) => (
                <a
                  dir="ltr"
                  key={phone.value}
                  href={`tel:${phone.value}`}
                  className="text-gray-700 hover:text-teal-700"
                >
                  {phone.text}
                </a>
              ))}
            </div>
          </div>
        </CollapseBox>
      </div>

      <div className="">
        <strong className="text-sm">املاین؛ آرامش در معاملات املاک</strong>
        <ShowMore>
          <p className="mb-2">با املاین هیچ اجاره‌ای عقب نمیفته! 🚀</p>
          <p className="mb-2">
            اینجا فضایی برای انعقاد قرارداد آنلاینه. به شما این امکان رو می‌ده که قراردادهای
            اجاره‌تون رو راحت و بدون دردسر حتی از خونه تنظیم کنید. کد رهگیری هم بلافاصله براتون صادر
            میشه. از همه مهم‌تر، با تضمین اجاره بها دیگه نگرانی بابت پرداخت اجاره از طرف مستاجر
            نخواهید داشت. اینطوریه که اگه مستاجر به هر دلیلی نتونه اجاره رو پرداخت کنه، املاین خودش
            به شما پرداخت می‌کنه.
          </p>
          <strong>چرا املاین؟</strong>
          <ul className="list-inside list-disc pr-1.5">
            <li>ثبت قرارداد آنلاین بدون مراجعه حضوری</li>
            <li>تضمین پرداخت اجاره‌ بها</li>
            <li>محاسبه کمیسیون قانونی و شفاف</li>
            <li>دریافت کد رهگیری بدون پیچیدگی</li>
          </ul>
        </ShowMore>

        {/* <ShowMore className="pt-1">
          <p>
            فضایی برای انعقاد قرارداد آنلاینه. املاین مجموعه‌ای از خدمات حقوقی مختلف تو حوزۀ املاک
            از جمله
            <Link className="text-blue-600" href="/contracts/new">
              &nbsp;انعقاد قرارداد
            </Link>
            ،
            <Link className="text-blue-600" href="/commission/calculate">
              &nbsp;محاسبۀ کمیسیون قرارداد
            </Link>
            ،
            <Link className="text-blue-600" href="/ads/new">
              &nbsp;ثبت آگهی&nbsp;
            </Link>
            و
            <Link className="text-blue-600" href="/requirements/new">
              &nbsp;ثبت نیازمندی‌
            </Link>
            ، جستجو در لیست
            <Link className="text-blue-600" href="/requirements">
              &nbsp;نیازمندی‌ها&nbsp;
            </Link>
            و
            <Link className="text-blue-600" href="/ads/for_sale">
              &nbsp;آگهی‌ها
            </Link>
            ی کاربران و استعلام‌های مختلف مربوط به ملک و… است اما به‌صورت آنلاین و در نرم‌افزارهای
            اندرویدی. اینجا راحت و بدون دردسر و مراجعه حضوری قرارداد ببندید، کد رهگیری دریافت کنید،
            بدون محدودیتِ سقف درگاه پرداخت (حتی بالای 200 میلیون تومان) پرداختی داشته باشید. تو
            املاین اول از حق کمیسیون قانونی قراردادت مطلع میشی، بعد اگه خواستی قرارداد می‌بندی و
            نیازی هم نیست که مبلغ اضافه‌تری بابت کمیسیون بدی.
          </p>
          <p>
            تو املاین هم خریدار برای خرید و مستاجر برای اجاره پیدا میشه و هم فروشنده برای فروش و
            مالک برای اجاره دادن.
          </p>
          <p>
            دیگه نیاز نیست مراجعۀ حضوری به مشاورین املاک داشته باشی، از همینجا مورد مدنظرت رو
            می‌تونی پیدا کنی.
          </p>
          <p>
            اگر هم مشاور املاک هستی، می‌تونی مشتری‌ها رو به مالکین و فروشنده‌ها معرفی کنی یا حتی
            مشتری پیدا کنی و حتی مشتری‌های خودت رو ثبت کنی تا باهات تماس بگیرن.
          </p>
          <strong>از همۀ جای دنیا می‌تونی قرارداد ببندی</strong>
          <p>
            چون بستر املاین، مجازی و آنلاین هست، شما هرجا که باشید و در هر ساعت از شبانه‌روز
            می‌تونید قرارداد ببندید. حتی ممکنه شما در کشور دیگه‌ای باشید و نیاز داشته باشید که
            ملکتون رو اجاره بدید یا بفروشید که تو پلتفرم املاین می‌تونید این کار رو انجام بدید.
          </p>
          <strong>اما چرا املاین اومده سراغ ملک و انعقاد قرارداد آنلاین؟</strong>
          <p>
            نمی‌دونم چقدر اطلاع دارید اما بیشترین پرونده‌های قضایی (حدود 70 درصد) مربوط به حوزۀ ملک
            هست. یعنی بزرگ‌ترین مشکل مردم خوب کشور ما از لحاظ حقوقی و دادگاهی تو حوزۀ ملک هست که ما
            در مورد بخشی از این مشکلات تو صفحۀ «دربارۀ ما» صحبت کردیم. املاین با دغدغۀ حل و کم کردن
            این مشکلات نقشۀ راه خودش رو ترسیم کرده. اصلی‌ترین راه حلی که املاین برای این مشکلات در
            نظر گرفته، در یک کلمه «انعقاد قرارداد آنلاین» هست. به نظر ما مجازی و آنلاین شدن این
            فرایند می‌تونه به حل این مشکلات کمک خوبی بکنه. اما چطوری؟
          </p>
          <ul className="list-disc pr-4">
            <li>
              <strong>برداشتن سقف درگاه پرداخت مالی:&nbsp;</strong>
              یکی از کارهایی که املاین انجام داده اینه که سقف درگاه پرداخت مالی رو برداشته. یعنی شما
              هر مبلغی که بالای 200 میلیون تومن باشه و بخوای بابت ملک جابجا کنی، مشکلی نداری و در
              نرم‌افزار املاین می‌تونی این کار رو انجام بدی و دیگه نیازی نیست که حضوری به بانک
              مراجعه کنی.
            </li>
            <li>
              <strong>صدور کد رهگیری آنلاین:&nbsp;</strong>
              گرفتن کد رهگیری مراحل مختلف پیچیده‌ای داره و سخته. اگه کسی انجام داده باشه و بلد باشه،
              می‌دونه که حداقل 5 تا 6 بار باید رفت‌وبرگشت داشته باشی و اگه بتونی کد رهگیری بگیری،
              تازه می‌تونی قراردادت رو ثبت کنی. املاین این کار رو به عهده گرفته و خودش برای مخاطبین
              کد رهگیری دریافت می‌کنه.
            </li>
            <li>
              <strong>حق کمیسیون قانونی و شفاف:&nbsp;</strong>
              قبل از این که قراردادت رو منقعد کنی، املاین جدای از قیمت ملک، حق کمیسیون قانونی رو به
              تناسب ملک برای شما محاسبه می‌کنه و به شما به‌طور شفاف اعلام می‌کنه و دیگه نیازی نیست
              که مبلغ اضافی برای این مورد پرداخت کنی.
            </li>
            <li>
              <strong>نمایشگاه سه‌بعدی املاک:&nbsp;</strong>
              در املاین تصاویر سه‌بعدی و با کیفیت و واقعی از املاک به نمایش گذاشته میشه طوری که
              می‌تونی خودت رو داخل خونه تصور کنی و بهتر تصمیم بگیری. تصاویر نه مبهم هستند و نه
              غیرواقعی.
            </li>
          </ul>
          <p>
            این‌ها بخشی از راه حل‌هایی بود که برای برخی از مشکلاتی که ذکر شد املاین در نظر گرفته.
            این‌ها همه یه گوشه‌ای از کاره و خیلی از امکانات دیگه ایجاد کردیم که نگو و نپرس و خودت
            باید بیای ببینی.
          </p>
        </ShowMore> */}
      </div>

      <div className="grid grid-cols-2 gap-8 mx-auto justify-items-center items-center">
        <div className="w-[70px] h-[70px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/senf_amlak.png"
            alt="senf_amlak"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-[70px] h-[70px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kasbokar.png" alt="kasbokar" className="w-full h-full object-contain" />
        </div>

        <div className="w-[70px] h-[70px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/senf_rayane.png"
            alt="senf_rayane"
            className="w-full h-full object-contain"
          />
        </div>

        <a
          aria-label="enamad"
          referrerPolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=524391&Code=9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
          rel="noreferrer"
          className="w-[70px] h-[70px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width={70}
            height={70}
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=524391&Code=9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
            alt="نماد اعتماد الکترونیک"
            className="w-full h-full object-contain"
            code="9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
          />
        </a>
      </div>
    </footer>
  )
}

export default OldFooter
