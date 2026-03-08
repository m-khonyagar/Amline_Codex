import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import { supportPhones, socialMediaLinks, COMPANY_ADDRESS } from '@/features/home'
import Phone2Icon from '@/components/icons/Phone2Icon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import CollapseBox from '@/components/ui/CollapseBox'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

import img01 from '@/assets/images/landing/phone-tracking-code/01.svg'
import committeeImage from '@/assets/images/landing/committee.svg'
import neshanImage from '@/assets/images/landing/neshan.png'
import googleMapImage from '@/assets/images/landing/google-map.png'
import baladImage from '@/assets/images/landing/balad.png'
// import image01 from '@/assets/images/landing/team/01.png'
// import image02 from '@/assets/images/landing/team/02.png'
// import image03 from '@/assets/images/landing/team/03.png'
// import image04 from '@/assets/images/landing/team/04.png'
// import image05 from '@/assets/images/landing/team/05.png'
// import image06 from '@/assets/images/landing/team/06.png'
// import image07 from '@/assets/images/landing/team/07.png'
// import image08 from '@/assets/images/landing/team/08.png'
// import image09 from '@/assets/images/landing/team/09.png'
// import searchImage from '@/assets/images/landing/search.svg'

// const team = [
//   {
//     id: 1,
//     name: 'محمد خنیاگر',
//     role: 'مدیرعامل و هم‌بنیان‌گذار',
//     image: image01.src,
//   },
//   {
//     id: 2,
//     name: 'محسن خنیاگر',
//     role: 'متخصص امور املاک \n هم‌بنیان‌گذار',
//     image: image02.src,
//   },
//   {
//     id: 3,
//     name: 'منصوره کبیری',
//     role: 'هم‌بنیان‌گذار و مدیر محصول',
//     image: image03.src,
//   },
//   {
//     id: 4,
//     name: 'محمد حسین تفضلیان',
//     role: 'توسعه دهنده نرم افزار',
//     image: image04.src,
//   },
//   {
//     id: 5,
//     name: 'محمد علی سلطانی پور',
//     role: 'توسعه دهنده نرم افزار',
//     image: image09.src,
//   },
//   {
//     id: 6,
//     name: 'محسن پدیدار',
//     role: 'توسعه دهنده نرم افزار',
//     image: image05.src,
//   },
//   {
//     id: 7,
//     name: 'احمد تلخابی',
//     role: 'توسعه دهنده نرم افزار',
//     image: image06.src,
//   },
//   {
//     id: 8,
//     name: 'عرفان رجبی',
//     role: 'طراح نرم افزار',
//     image: image07.src,
//   },
//   {
//     id: 9,
//     name: 'مصطفی کبیری',
//     role: 'امور منابع انسانی',
//     image: image08.src,
//   },
// ]

function AboutUsPage() {
  return (
    <>
      <HeaderNavigation
        title="درباره ما"
        keywords="درباره املاین, املاک آنلاین, قرارداد هوشمند ملک, خرید و فروش آنلاین ملک, اجاره نامه اینترنتی, سامانه املاک, کمیسیون رایگان املاک, تیم املاین, درباره ما, املاک بدون دلال"
        noIndex
      />

      <div className="px-6 pt-3 flex flex-col text-justify bg-[url('/images/about-us-bg.jpg')] bg-cover bg-center">
        <Image
          alt=""
          src="/images/logotype.svg"
          width={140}
          height={54}
          className="mx-auto mb-[30%]"
        />
        <p className="font-bold text-[13px] mb-3 text-white text-center [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">
          املاین یک املاک امن و آنلاین به وسعت کل کشوره که امکان بستن قرارداد رهن و اجاره‌‌ و خرید و
          فروش به‌صورت آنلاین رو برای مخاطبان فراهم کرده.
        </p>
      </div>

      <div className="bg-[#404040] text-white py-3 px-6 text-justify">
        <p>
          شما می‌تونید قرارداد ملکی‌تون رو به‌صورت برخط، سریع و آسون در بستر املاین بنویسید و کد
          رهگیری دریافت کنید. قراردادهایی که تو املاین نوشته می‌شن، اول کارشناسای حقوقی ما بررسی
          می‌کنن و بعد براش کد رهگیری دریافت می‌کنن.
          <br />
          شرکت تحلیل آوران املاک روز (املاین) به شماره ثبت 21567 تلاش می‌کنه تا همه‌ی خدمات در مورد
          ملک رو که مردم با مراجعه‌ی حضوری دفاتر و سازمان‌های مربوطه مثل دفتر املاک دریافت می‌کنن
          به‌صورت مجازی و برخط، ارائه بده. هدف‌مون هم اینه که تجربه‌ی متفاوت و دسترسی بهتری رو به
          امکاناتی مثل انعقاد قرارداد، ثبت آگهی و نیازمندی، استعلامات برخط، محاسبه کمیسیون قانونی و
          … برای شما کاربران فراهم کنیم.
        </p>
      </div>

      {/* <div className="bg-[#B3CFD9] py-3 px-6">
        <div className="flex gap-1 justify-center mb-6">
          <Image alt="" src={searchImage.src} width={31} height={31} />
          <p className="text-lg font-semibold mt-auto">آشنایی با تیم املاین</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((p) => (
            <div key={p.id} className="mx-auto text-center">
              <div className="bg-[#5B5B5B] rounded-full w-[90px] h-[90px] mx-auto">
                {p.image && <Image src={p.image} alt={p.name} width={90} height={90} />}
              </div>
              <strong>{p.name}</strong>
              <span className="block whitespace-pre-line text-sm text-[#0E5C5E]">{p.role}</span>
            </div>
          ))}
        </div>
      </div> */}

      <div className="px-6 pt-3 mb-6">
        <div className="flex gap-2.5">
          <Image src={img01.src} width={15} height={22} alt="" />
          <p className="font-bold">چرا املاین ایجاد شده و قراره چیکار بکنه؟</p>
        </div>
        <p className="text-justify">
          برای این که به این سؤال پاسخ بدهیم، لازمه که نکاتی رو با هم مرور کنیم. این که چرا ما سراغ
          معاملات مربوط به ملک اومدیم؟ به این خاطر هست که سختی‌های زیادی برای خیلی از مردم در این
          مورد اتفاق افتاده و شاید برای خود ما هم در این‌ باره مشکل ایجاد شده باشه.
          <br />
          یکی از مشکلاتی که بر سر راه مستاجرها هست، پیدا کردن خونۀ مناسبه. هرسال بیش از 9 میلیون
          سرپرست خانوار داریم که یا می‌خوان خونه اجاره کنن یا می‌خوان اجارۀ قبلی رو تمدید کنن.
          به‌این‌خاطر هم باید مدام به املاکی‌ها و بنگاه‌های املاک مراجعه کنند تا بالاخره قرارداد
          ببندند و قرارداد که تموم بشه، روز از نو و روزی از نو. گرچه شاید یک‌سری نرم‌افزارهایی باشه
          که آگهی‌های ملک رو به نمایش بذاره اما دوتا مشکل اصلی داره؛ یکی این که تصاویری که از ملک
          میذارن، یا نامعلوم و مبهمه یا جعلی و دیگه این که اصلا ممکنه آگهی الکی گذاشته باشن که در هر
          دو صورت، آدم سرکار میره.
          <br />
          کاشکی مشکل فقط همین بود. بدتر اینه که مردمی که غالبا درآمد چندانی ندارن باید برا بستن
          قرارداد، حق کمیسیون بدن و مشکل اصلی اینجا است که خیلی از بنگاه‌ها و مشاورین املاک،
          چندبرابر گرون‌تر از حق کمیسیون قانونی می‌گیرن و مردم هم برای این که بی‌سرپناه نمونن،
          مجبورن این مبلغ رو بپردازن اما اصلا معلوم نیست که این مبلغ از کجا و بر چه اساسی تعیین شده
          و هیچ شفافیتی در این مورد وجود نداره!
          <br />
          یکی از مسائل دیگه‌ای که در این مورد هست اینه که برای ثبت قرارداد قانونی، باید کد رهگیری
          گرفته بشه. خیلی از اوقات میشه که یکی از طرفین قرارداد نمی‌تونه حضور داشته باشه و قانون و
          بنگاهی‌ها میگن که باید هر دو طرف باشن تا بشه کد رهگیری گرفت اما با مجازی و آنلاین شدن و در
          دسترس بودن اطلاعات هویتی طرفین، احراز هویت به‌صورت مجازی صورت می‌گیره و نیازی نیست که هر
          دو طرف حضور داشته باشن و این فرایند می‌تونه کاملا مجازی انجام بشه و شما در هر نقطه‌ای از
          کشور که باشین می‌تونین قرارداد ببندید. ضمنا باید حواسمون باشه که کد رهگیری یه نیاز ضروریه؛
          چون مواردی مثل ثبت‌نام فرزند در مدرسه، درخواست وام و… نیاز هست که نمیشه ساده از کنارش
          گذشت. یک نکتۀ دیگه هم که باید بدونید اینه که گرفتن کد رهگیری فرایند سخت و پیچیده‌ای داره و
          معمولا افراد حتی بعد از 5-6 بار تلاش نتونستند دریافت کنند و قراردادشون رو در سامانۀ ما
          نوشتن تا ما براشون کد رهگیری بگیریم.
          <br />
          تازه اینا که گفتیم یه بخشی از مشکلات بود. بخشی دیگۀ مشکل اینه که غالبا مبلغ پرداختی رهن
          بالای 200 میلیون هست و به‌خاطر محدودیتی که سقف تراکنش داره، نمیشه کارت به کارت کرد و مجازی
          واریز کرد. تنها راه هم این هست که هر دو طرف (مالک و مستاجر) به بانک مراجعه کنن و کلی وقت
          تلف کنن تا بتونن این مبلغ رو انتقال بدن.
          <br />
          از همۀ این موارد که بگذریم، خدا نکنه که طرفین قرارداد به اختلاف و مشکل بخورن. اگه این
          اتفاق بیفته و قرارداد کتبی هم داشته باشن، باید دست کم دو سه ماه برن و بیان تا شاید به
          نتیجه برسن اما وای به حال روزی که فقط به‌صورت شفاهی باهم قرار گذاشته باشن و براساس اصل
          برادری و محبت و انسان‌دوستی پیش رفته باشن. اگه این‌طور باشه که دادگاه رفتن هم فایده نداره.
          بگذریم، إن شاء الله که این مشکل برا کسی پیش نیاد اما در هر صورت احتیاط، شرط عقله و حتما
          شما هم با موافق هستید که به قول معروف، پیشگیری بهتر از درمانه. راه حل واضح و مشخصه؛ بستن
          یک قرارداد محکم و اصولی. املاین سعی کرده که همۀ ویژگی‌های یک قرارداد درست و اصولی رو فراهم
          کنه. ضمنا این رو هم بدونید که اگر قراردتون مشکلی داشته باشه، کارشناسای ما بررسی می‌کنن و
          با شما تماس می‌گیرن و اشکالات رو به شما میگن تا خدای نکرده به دردسر نیفتید. حالا شما ممکنه
          سؤال کنید که اگه ما با طرف معامله به مشکل و اختلاف خوردیم چی؟! هرچیزی راه حلی داره. املاین
          برا این قضیه هم راه حلی در نظر گرفته. راه حل چیه؟ داوری.
        </p>
      </div>

      <div className="px-6 flex flex-col gap-[12px] text-sm mb-9">
        <CollapseBox
          label={
            <div className="flex items-center">
              <Image src={committeeImage.src} width={38} height={38} className="ml-3" alt="" />
              <p className="font-bold">اگه میخوای بدونی داوری چیه؟</p>
            </div>
          }
          labelClassName="p-4"
          className="bg-white shadow-md rounded-2xl"
          contentClassName="text-sm px-4 pb-4"
        >
          <p className="leading-[20px] mb-4">
            داوری یکی از راه هایی برای حل اختلاف بین دو طرفه، که طرفین میتونن توافق کنن اگر به مشکلی
            خوردن به جای اینکه برن دادگاه و کلی پله های اداره هارو طی بکشن، خودشون یک داور رو انتخاب
            کنن تا اگر به مشکل خوردن اون به مشکلشون رسیدگی کنه. جالبه بدونی که حکمی که داور صادر
            میکنه لازم الاجرا در تمام ارگان های دولتی و خصوصیه!
            <br />
            قراردادهایی که در املاین نوشته می‌شن، شرط «داوری» رو به صورت پیش فرض دارن، سیستم داوری
            املاین از متخصصین خبره‌ی حقوقی و کارشناسان با تجربه‌ی ملکی تشکیل شده تا بطور دقیق و سریع
            به مشکلات رسیدگی و حکم صحیح صادر بشه.
          </p>
        </CollapseBox>
      </div>

      <div className="bg-[#E2F7FF] px-8 py-6 text-center -mb-28">
        <div className="w-full h-[145px] rounded-[10px] border border-[#6A6A6A] overflow-hidden mb-2">
          <iframe
            id="about-us-map"
            title="about-us-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4428778569245!2d50.8123231!3d34.5676588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93a300086b1331%3A0x1d6a7f3ac0890e2c!2z2KfZhdmE2KfbjNmG!5e0!3m2!1sfa!2s!4v1770545867050!5m2!1sfa!2s"
            height="143"
            className="w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex gap-3 justify-center mb-3">
          <a
            href="https://maps.app.goo.gl/uDTrCjYFPqsT8E5L7"
            target="_blank"
            rel="noreferrer"
            aria-label="address"
          >
            <Image
              alt=""
              src={googleMapImage.src}
              height={30}
              width={30}
              className="h-[30px] w-[unset]"
            />
          </a>
          <a
            href="https://balad.ir/location?latitude=34.567684&longitude=50.812357&zoom=16.500000"
            target="_blank"
            rel="noreferrer"
            aria-label="address"
          >
            <Image
              alt=""
              src={baladImage.src}
              height={30}
              width={30}
              className="h-[30px] w-[unset]"
            />
          </a>
          <a
            href="https://nshn.ir/vbsAMsWxsvyk"
            target="_blank"
            rel="noreferrer"
            aria-label="address"
          >
            <Image
              alt=""
              src={neshanImage.src}
              height={30}
              width={30}
              className="h-[30px] w-[unset]"
            />
          </a>
        </div>
        <p className="mb-3">{COMPANY_ADDRESS}</p>
        <div className="flex justify-center gap-2">
          <a
            href={socialMediaLinks.INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex gap-2"
          >
            <InstagramIcon size={20} />
            {publicRuntimeConfig.BASE_URL}
          </a>
          <a
            href={socialMediaLinks.TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="flex gap-2"
          >
            <TelegramIcon size={20} />
            amline
          </a>
        </div>
        {supportPhones.map((phone) => (
          <div className="flex justify-center gap-2">
            <Phone2Icon size={20} />
            <span>
              <a dir="ltr" key={phone.value} href={`tel:${phone.value}`}>
                {phone.text}
              </a>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default AboutUsPage
