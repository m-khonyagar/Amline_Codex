import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import phoneRingImg01 from '@/assets/images/landing/phone-home.svg'
import img01 from '@/assets/images/landing/phone-tracking-code/01.svg'
import img12 from '@/assets/images/landing/phone-tracking-code/12.png'
import img13 from '@/assets/images/landing/phone-tracking-code/13.png'
import img14 from '@/assets/images/landing/phone-tracking-code/14.png'
import img15 from '@/assets/images/landing/phone-tracking-code/15.png'
import callIcon from '@/assets/images/landing/contract-guarantee/call-icon.svg'
import { supportPhones } from '@/features/home'

export default function PhonePropertyConsult() {
  return (
    <>
      <HeaderNavigation title="مشاوره تلفنی یافتن ملک" />
      <div className="px-6">
        <div className="text-center pt-10 mb-2">
          <Image
            src={phoneRingImg01.src}
            width={125}
            height={125}
            className="mx-auto mb-[35px]"
            alt=""
          />
          <h2 className="font-bold text-[16px] mb-2">مشاوره تلفنی یافتن ملک</h2>
          <p className="text-sm text-[#878787] max-w-sm text-center mx-auto">
            اگر دنبال ملک می گردی و پیدا نمی کنی، با کارشناس های املاین تماس بگیرید تا شبیه ترین
            ملکی که نیاز دارید رو بهتون معرفی کنن!
          </p>
        </div>

        <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4 mb-[50px] text-[11px]">
          <Image src={img01.src} width={37} height={53} className="mx-auto mb-6" alt="" />
          <p className="font-bold mb-1.5">تیم پشتیبانی املاین چه کار می کنه؟</p>
          <p>
            اگر دنبال ملکی هستی که پیدا نمی‌کنی و بین صدها آگهی هر روز داری سایت ها رو بالا و پایین
            اما پیداش نمی کنی؛ با املاین تماس بگیر تا ملکی که نیاز دارید رو بهتون معرفی کنیم. وقتی
            به املاین می سپارین که ملک رو برای شما پیدا کنه، دیگه خیالتون راحت باشه، کارشناس های
            املاین مدام در حال تعامل با مالک ها هستن تا بهترین خونه رو برای شما پیدا کنن و خوش حال
            تون کنن :)
          </p>
        </div>

        <div className="mb-12">
          <p className="text-center font-bold text-[16px] mb-6">
            چطوری به املاین بسپرم که بهم ملک معرفی کنه؟
          </p>

          <div className="text-justify text-[11px]">
            <div className="flex items-center gap-[12px] relative mb-[55px]">
              <Image src={img12.src} width={66} height={67} alt="" />
              <p>1: با املاین تماس بگیر و مشخصات ملکی که دنبالش می گردی رو به کارشناس ها بگو.</p>
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
              <Image src={img13.src} width={66} height={66} alt="" />
              <p>
                2: کارشناس های املاین از بین خونه هایی که مالک ها به ما سپردن تا به شما ارائه کنیم،
                شبیه ترین موارد رو پیدا می کنن.
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
              <Image src={img15.src} width={66} height={67} alt="" />
              <p>3: کارشناس ها باهاتون تماس می‌گیرن و ملک ها رو معرفی می کنن.</p>
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
                4: شرایط هر ملکی رو پسندیدی، با مالک هماهنگ می کنیم و قرار بازدید از ملک برات تنظیم
                میشه.
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
