/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import trust1Img from '@/assets/images/landing/mashinet/trust-1.svg'
import trust2Img from '@/assets/images/landing/mashinet/trust-2.svg'
import trust3Img from '@/assets/images/landing/mashinet/trust-3.svg'
import arrowDownImg from '@/assets/images/landing/mashinet/arrow-down.svg'
import headerBgImg from '@/assets/images/landing/mashinet/mashinet-header-bg.png'

import TelegramIcon from '@/components/icons/TelegramIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import { socialMediaLinks, supportPhones } from '@/features/home'

function MashinetLandingPage() {
  return (
    <div>
      <Head>
        <title>ماشینت، دستیار خرید خودرو | املاین</title>
        <meta
          key="description"
          name="description"
          content="ماشینت، دستیار خرید خودرو، همراه و پشتیبان شماست تا این ترس‌ها رو از بین ببریم و تجربه‌ای لذت‌بخش از خرید خودرو رو براتون رقم بزنیم. ما همه کارها رو به عهده می‌گیریم تا شما فقط لذت انتخاب بهترین ماشین رو تجربه کنین، بدون استرس و نگرانی."
        />
        <meta
          key="og:description"
          property="og:description"
          content="ماشینت، دستیار خرید خودرو، همراه و پشتیبان شماست تا این ترس‌ها رو از بین ببریم و تجربه‌ای لذت‌بخش از خرید خودرو رو براتون رقم بزنیم. ما همه کارها رو به عهده می‌گیریم تا شما فقط لذت انتخاب بهترین ماشین رو تجربه کنین، بدون استرس و نگرانی."
        />
        <meta key="og:image" property="og:image" content={headerBgImg.src} />
        <meta key="twitter:image" property="twitter:image" content={headerBgImg.src} />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="257" />
      </Head>
      <div
        className="relative flex flex-col"
        style={{
          height: `calc(100vh - 96px)`,
          maxHeight: `588px`,
          clipPath: `polygon(0 0, 100% 0%, 100% 85%, 50% 100%, 0 85%)`,
        }}
      >
        <div
          className="absolute top-0 left-0 bottom-0 right-0 z-0"
          style={{
            background: `url(${headerBgImg.src}) no-repeat`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
        <div className="bg-black/30 absolute top-0 left-0 bottom-0 right-0 z-1" />
        <a href="#intro" className="absolute bottom-0 left-1/2 -translate-x-1/2 z-2">
          <img className="animate-bounce" src={arrowDownImg.src} alt="down" />
        </a>
        <div className="relative z-10 text-white text-4xl md:text-5xl leading-relaxed md:leading-relaxed text-center mt-8">
          تا حالا موقع خرید
          <br />
          ماشین <span className="font-bold">نگران</span> بودی؟!
        </div>
        <div className="relative z-10 my-auto flex justify-around text-white">
          <a href="#trust1" className="text-center basis-1/3">
            <img src={trust1Img.src} alt="trust" className="mx-auto" />
            <div className="font-semibold mt-2">انتخاب خودرو</div>
            <div className="font-light text-sm md:text-base">دقیقا همونی که نیاز داری!</div>
          </a>

          <a href="#trust2" className="text-center basis-1/3">
            <img src={trust2Img.src} alt="trust" className="mx-auto" />
            <div className="font-semibold mt-2">کارشناسی خودرو</div>
            <div className="font-light text-sm md:text-base">برای اینکه خیالت راحت باشه!</div>
          </a>

          <a href="#trust3" className="text-center basis-1/3">
            <img src={trust3Img.src} alt="trust" className="mx-auto" />
            <div className="font-semibold mt-2">قراردادضمانت شده</div>
            <div className="font-light text-sm md:text-base">بدون هیچ نگرانی!</div>
          </a>
        </div>

        <div className="relative z-10 my-auto mx-auto text-sm py-1 px-4 rounded-md bg-[#FF6500] text-white">
          ما این مشکلو برات حل کردیم...
        </div>
      </div>

      <div id="intro" className="pt-8 mx-8">
        <h2 className="text-center text-xl">اینجاست ک ما وارد عمل میشیم!</h2>
        <div className="mx-auto max-w-lg text-justify mt-3">
          ماشینت، دستیار خرید خودرو، همراه و پشتیبان شماست تا این ترس‌ها رو از بین ببریم و تجربه‌ای
          لذت‌بخش از خرید خودرو رو براتون رقم بزنیم. ما همه کارها رو به عهده می‌گیریم تا شما فقط لذت
          انتخاب بهترین ماشین رو تجربه کنین، بدون استرس و نگرانی.
        </div>

        <div className="text-center mt-8">
          <div>برای یه خرید امن و بی‌دغدغه فرم زیر رو پر کنین:</div>
          <a
            size="sm"
            target="_blank"
            rel="noreferrer"
            href="https://survey.porsline.ir/s/r6XL9bX2"
            className="text-[#FF6500] hover:bg-[#FF6500]/5 inline-block mt-2 px-4 py-2 border border-[#FF6500] rounded-lg"
          >
            خرید امن و بی‌دغدغه
          </a>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-center text-xl">چطور کمکتون می‌کنیم؟</h2>

        <div id="trust1" className="bg-[#1E3E62] text-white max-w-[300px] md:max-w-md p-4 mt-8">
          <div className="text-4xl font-black">01</div>
          <div className="font-bold text-lg mt-4">
            انتخاب بهترین خودرو،
            <br />
            دقیقاً همونی که نیاز دارین:
          </div>
          <div className="font-light mt-6 text-justify">
            شاید تا حالا شده باشه که بین چندین مدل خودرو سردرگم بشین و نگران باشین که کدومش بهتره.
            تیم ما با تجربه و تخصصی که داره، دقیقاً نیازها و سلیقه شما رو می‌سنجه و بهترین گزینه‌ها
            رو بهتون معرفی می‌کنه. دیگه نیازی نیست خودتون تو دنیای پیچیده خودروها دنبال ماشین
            بگردین.
          </div>
        </div>

        <div
          id="trust2"
          className="bg-[#39597C] text-white max-w-[300px] md:max-w-md p-4 mt-4 mr-auto"
        >
          <div className="text-4xl font-black text-left">02</div>
          <div className="font-bold text-lg mt-4">
            کارشناسی کامل خودرو،
            <br />
            برای اینکه خیالتون راحت باشه:
          </div>
          <div className="font-light mt-6 text-justify">
            از خرید ماشینی که بعداً مشکل فنی یا بدنه داشته باشه، وحشت دارین؟ حق دارین، چون هزینه‌های
            پنهان زیادی ممکنه به دنبالش بیاد. ما با کارشناسان حرفه‌ای، همه چیز رو زیر ذره‌بین
            می‌ذاریم؛ از موتور و گیربکس گرفته تا رنگ و بدنه. پس شما با خیال راحت خریدتون رو انجام
            بدین، چون ما تضمین می‌کنیم چیزی از قلم نمی‌افته.
          </div>
        </div>

        <div id="trust3" className="bg-[#4C617A] text-white max-w-[300px] md:max-w-md p-4 mt-4">
          <div className="text-4xl font-black">03</div>
          <div className="font-bold text-lg mt-4">
            قرارداد شفاف و ضمانت‌شده،
            <br />
            بدون هیچ نگرانی:
          </div>
          <div className="font-light mt-6 text-justify">
            همیشه یکی از بزرگترین ترس‌های خرید خودرو، مسائل حقوقی و مالیه. نگرانین که اگه یه اتفاقی
            بیفته چطور حق و حقوقتون رو پیگیری کنین؟ ماشینت اینجاست تا قراردادی رو براتون تنظیم کنه
            که تمام جزئیات رو پوشش بده. مهم‌تر از اون، ماشینت از طریق پلتفرمش، همه تراکنش‌ها رو
            نظارت می‌کنه تا اگه مشکلی پیش اومد، پشتیبان شما باشه و بتونین روش حساب کنین.
          </div>
        </div>
      </div>

      <div className="bg-[#474747] text-white -mb-8 pt-4 pb-12 mt-8 text-center text-lg">
        <div>برای خرید و معامله خودرو با ما تماس بگیرید:</div>

        <div className="mt-2 flex flex-col gap-2">
          {supportPhones.map((phone) => (
            <a dir="ltr" href={`tel:${phone.value}`} className="fa">
              {phone.text}
            </a>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-8 justify-center">
          <a
            href={socialMediaLinks.INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex text-white hover:text-teal-700 gap-2"
            aria-label="instagram"
          >
            <InstagramIcon size={20} />
          </a>

          <a
            href={socialMediaLinks.TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex text-white hover:text-teal-700 gap-2"
            aria-label="telegram"
          >
            <TelegramIcon size={20} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default MashinetLandingPage
