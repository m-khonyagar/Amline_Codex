import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import trackingCodeImg01 from '@/assets/images/landing/phone-tracking-code/tracking-code.svg'
import img01 from '@/assets/images/landing/phone-tracking-code/01.svg'
import img11 from '@/assets/images/landing/phone-tracking-code/11.png'
import img12 from '@/assets/images/landing/phone-tracking-code/12.png'
import img13 from '@/assets/images/landing/phone-tracking-code/13.png'
import img14 from '@/assets/images/landing/phone-tracking-code/14.png'
import callIcon from '@/assets/images/landing/contract-guarantee/call-icon.svg'
import { supportPhones } from '@/features/home'

export default function PhoneTrackingCode() {
  return (
    <>
      <HeaderNavigation title="دریافت کد رهگیری تلفنی" />
      <div className="px-6">
        <div className="text-center py-10">
          <Image
            src={trackingCodeImg01.src}
            width={213}
            height={125}
            className="mx-auto mb-[23px]"
            alt=""
          />
          <h2 className="font-bold text-[16px]">کد رهگیری تلفنی</h2>
          <p className="text-sm text-[#878787]">چطور میتونم تلفنی کد رهگیری بگیرم؟</p>
        </div>

        <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4 mb-6 text-[11px]">
          <Image src={img01.src} width={37} height={66} className="mx-auto mb-6" alt="" />
          <p className="font-bold mb-1.5">کد رهگیری چیه و چرا باید بگیرم؟</p>
          <p>
            کد رهگیری یه کده که از طرف سازمان املاک و اسکان صادر میشه و میتونه خیالتو از این بابت
            راحت کنه که ملکی که اجاره کردی در هیچ جای دیگه به کس دیگه ای اجاره داده نشده. همچنین اگه
            بچه مدرسه ای داشته باشی برای ثبت نامش حتما باید قرارداد با کد رهگیری ارائه کنی. اگرم یه
            موقعی قرار باشه وام ودیعه مسکن بدن اگه کد رهگیری داشته باشی شامل تو هم میشه. حتی اگه یه
            روزی قراردادت گم بشه یا چایی روش بریزه همیشه به متن قراردادت دسترسی داری و همیشه قابل
            استعلام هست!
          </p>
        </div>

        <div className="mb-12">
          <p className="text-center font-bold text-[16px] mb-6">چطوری از املاین کد رهگیری بگیرم؟</p>

          <div className="text-justify text-[11px]">
            <div className="flex items-center gap-[12px] relative mb-[55px]">
              <Image src={img11.src} width={66} height={59} alt="" />
              <p>1: قراردادت رو منعقد میکنی.</p>
              <div className="absolute right-[33px] -bottom-1 translate-y-full">
                <svg
                  width="66"
                  height="48"
                  viewBox="0 0 66 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M64.9983 -0.00026486C65.0007 51 1.49827 9.49999 1.49929 47.4998"
                    stroke="#676767"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-[12px] relative mb-[48px] mr-[63px]">
              <Image src={img12.src} width={66} height={67} alt="" />
              <p>
                2: تماس میگیری با پشتیبانی املاین و یه وقت رزرو میکنی که هم خودت هم طرف دیگه در
                دسترس باشید.
              </p>

              <div className="absolute -right-[33px] -bottom-2 translate-y-full">
                <svg
                  width="69"
                  height="40"
                  viewBox="0 0 69 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.58431 0.489799C1.58417 44.9999 66.0016 -8.49979 67.5017 39.4998"
                    stroke="#676767"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-[12px] relative mb-[48px]">
              <Image src={img13.src} width={66} height={67} alt="" />
              <p>
                3: تو زمانی که با هم تنظیم کردین پشتیبان باهاتون تماس میگیره و اطلاعات قراردادتون رو
                ازتون میپرسه. (اگر توی املاین قرارداد نوشته باشی که نیازی به این کار نیست!) چند تا
                کد برات میاد و دیگه کاری نداری.
              </p>
              <div className="absolute right-[33px] bottom-0 translate-y-full">
                <svg
                  width="66"
                  height="48"
                  viewBox="0 0 66 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M64.9983 -0.00026486C65.0007 51 1.49827 9.49999 1.49929 47.4998"
                    stroke="#676767"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-[12px] mr-[63px]">
              <Image src={img14.src} width={66} height={67} alt="" />
              <p>
                4: و تمام...
                <br />
                بعد از ۴۰ دقیقه که کد برات صادر شد برات پیامک میشه؛ به همین راحتی!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-sm font-extrabold text-center mb-3">
            اگر نیاز به اطلاعات بیشتری دارید، یا میخواید کد رهگیری دریافت کنید، با شماره های زیر در
            ارتباط باشید:
          </p>

          <div className="flex gap-1 justify-center text-sm fa">
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
          </div>
        </div>
      </div>
    </>
  )
}
