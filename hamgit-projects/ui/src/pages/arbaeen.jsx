import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import SEO from '@/components/SEO'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Footer } from '@/features/home'
import { withBaseLayout } from '@/features/app'
import { useGuideContext } from '@/features/guide'
import { HelpIcon, PhoneIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'

import Banner from '@/assets/images/landing/arbaeen-banner.webp'

function Arbaeen() {
  const { setIsOpen: setGuideIsOpen } = useGuideContext()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isValidPhone = /^09\d{9}$/.test(phone)

    if (!isValidPhone) {
      setError('شماره موبایل وارد شده معتبر نیست')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwoXaFr0TozbPZD_5rxMj2oOq63Z3wOyhCVYPbucLqeYvpiwez0KYtzdgSeoLkQkeWLlg/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            phone,
          }),
        }
      )

      const message = await res.text()

      if (message === 'Success') {
        setPhone('')
        toast.success('شماره شما ثبت شد. همکاران ما به‌زودی با شما تماس می‌گیرند.')
      } else toast.error('مشکلی پیش آمده است لطفا دوباره تلاش کنید')
    } catch (err) {
      console.error('Error submitting form:', err)
      toast.error('مشکلی پیش آمده است لطفا دوباره تلاش کنید')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="کمپین نذری املاین به مناسبت محرم و اربعین"
        description="املاین امسال نذر متفاوتی داره: به‌جای غذای نذری، ۱ میلیون تومان تخفیف قرارداد برای ۲۰۰ نفر اول. کافیه عدد ۱ رو به ۳۰۰۰۱۱۹۹۲۴ پیامک کنی"
      />

      <div className="flex items-center justify-between gap-1 border-b border-[#E1E1E1] bg-white px-7 py-3">
        <Link href="/">
          <h1>
            <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
          </h1>
        </Link>

        <button
          type="button"
          onClick={() => setGuideIsOpen(true)}
          className="flex items-center justify-center"
        >
          <HelpIcon id="help" />
        </button>
      </div>

      <div className="w-full relative aspect-[72/53]">
        <Image src={Banner.src} alt="نذری املاین" fill />
      </div>

      <div className="p-7">
        <div className="p-4 rounded-[16px] relative bg-white -mt-10">
          <h1 className="text-lg font-medium text-center mb-4">تاحالا نذری این مدلی دیده بودی؟</h1>

          <p>
            تو این شب‌ و روزهای محرم که دل‌ها به هم نزدیک‌تر می‌شن، هرکی سعی می‌کنه به نوعی کمک کنه؛
            ما هم امسال یه نذر متفاوت کردیم:
          </p>

          <p className="text-[#402897]">
            به جای غذای نذری، به مستاجرها و مالک‌هایی که میخوان قرارداد بنویسن، ۱ میلیون تومان تخفیف
            نذری می‌دیم!
          </p>

          <p>
            مهم نیست کی می‌خوای خونه اجاره کنی، اما فقط ۲۰۰ نفر اول که دنبال قرارداد خونه هستن،
            می‌تونن از این نذر یک میلیونی استفاده کنن تا راحت‌تر و بدون هزینه اضافی، خونه دلخواهشونو
            پیدا کنن!
          </p>
        </div>
      </div>

      <div
        className="py-5 px-7"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, #94d2c67f 0%, #3495927f 100%)' }}
      >
        <p className="fa text-center font-bold">
          پس یادت نره یک میلیون تومن از طرف امام حسین، پیش ما اعتبار داری! فقط تا 200 نفر اول که عدد
          1 رو به <u>3000119924</u> ارسال کنن...
        </p>

        <p className="text-center font-bold mb-3">
          اگه میخوای شمارت رو اینجا ثبت کن تا باهات تماس بگیریم:
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label={<span className="text-lg text-[#127B7D] font-medium">شماره تلفن</span>}
            name="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (error) setError('')
            }}
            error={error}
            suffix={<PhoneIcon />}
            placeholder="11 رقم"
          />

          <div className="flex justify-center">
            <Button
              size="sm"
              type="submit"
              className="w-24 bg-[#127B7D]"
              style={{ boxShadow: '0px 4px 4px 0px #00000040' }}
              loading={isLoading}
            >
              ثبت
            </Button>
          </div>
        </form>
      </div>

      <Footer className="-mb-8" />
    </>
  )
}

export default withBaseLayout(Arbaeen, {
  bottomNavigation: true,
  requireAuth: false,
  bottomCTA: false,
})
