import { cn } from '@/utils/dom'
import classes from './HowCreateContract.module.scss'
import { LocationBold2Icon } from '@/components/icons'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

function HowCreateContract({ className }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  })

  return (
    <div className={cn(className)} ref={ref}>
      <div
        className={cn(classes.container, 'relative w-[350px] mx-auto pb-4', {
          [classes['container--show']]: isIntersecting,
        })}
      >
        <svg
          width="275"
          height="722"
          viewBox="0 0 275 722"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <path
            className={classes.path1}
            opacity="0.29"
            d="M272 0V94.9995C272 111.568 258.569 124.999 242 124.999H205.5C188.931 124.999 175.5 138.431 175.5 154.999V172.999C175.5 189.568 162.069 202.999 145.5 202.999H55.5C38.9315 202.999 25.5 216.431 25.5 232.999V252.999C25.5 269.568 38.9315 282.999 55.5 282.999H145.5C162.069 282.999 175.5 296.431 175.5 312.999V323.499C175.5 340.068 162.069 353.499 145.5 353.499H33C16.4315 353.499 3 366.931 3 383.499V482.777C3 499.432 16.5672 512.899 33.2221 512.776L107.778 512.224C124.433 512.1 138 525.568 138 542.223V569.999V670"
            stroke="black"
            strokeWidth="6"
            strokeDasharray="1246 1246"
            strokeDashoffset="1246"
          />
          <path
            className={classes.path2}
            opacity="0.29"
            d="M138 672.999L189.591 671.436C206.508 670.923 220.5 684.498 220.5 701.422V719.499M138 672.999H87C70.4315 672.999 57 686.431 57 702.999V721.999"
            stroke="black"
            strokeWidth="6"
            strokeDasharray="235 235"
            strokeDashoffset="235"
          />
        </svg>
        <h3 className="font-medium text-center absolute top-[24px] left-1/2 -translate-x-1/2 w-full text-lg">
          چجوری تو املاین قرارداد بنویسم؟!
        </h3>

        <div className={cn(classes.step1, 'absolute top-[107px] right-[35%]')}>
          <div className="text-[#038486] font-bold text-2xl flex items-end leading-0">
            <LocationBold2Icon size={30} />
            01
          </div>
          <div className="font-bold mr-9 -mt-1.5">ایجاد قرارداد</div>
          <div className="font-light text-sm mr-9">وارد کردن اطلاعات طرفین </div>
        </div>

        <div className={cn(classes.step2, 'absolute top-[258px] left-[54%] text-left')}>
          <div className="text-[#28AEB0] font-bold text-2xl flex items-end justify-end leading-0">
            02
            <LocationBold2Icon size={30} />
          </div>
          <div className="font-bold ml-9 -mt-1.5">مشخصات مورد معامله</div>
          <div className="font-light text-sm ml-9">مشخصات ملک</div>
        </div>

        <div className={cn(classes.step3, 'absolute top-[364px] left-[7.2%] text-left')}>
          <div className="text-[#56CACC] font-bold text-2xl flex items-end justify-end leading-0">
            03
            <LocationBold2Icon size={30} />
          </div>
          <div className="font-bold ml-9 -mt-1.5">وارد کردن اطلاعات پرداخت</div>
          <div className="font-light text-sm ml-9">
            قسط بندی مبلغ پرداختی و یا
            <br />
            اقساط ماهیانه اجاره
          </div>
        </div>

        <div className={cn(classes.step4, 'absolute top-[488px] left-[43.5%] text-left')}>
          <div className="text-[#56CACC] font-bold text-2xl flex items-end justify-end leading-0">
            04
            <LocationBold2Icon size={30} />
          </div>
          <div className="font-bold ml-9 -mt-1.5">مشاهده قرارداد</div>
          <div className="font-light text-sm ml-9">
            تدوین بند های قرارداد و
            <br />
            امضای آن
          </div>
        </div>

        <div className={cn(classes.step5, 'flex justify-around mx-4 mt-1')}>
          <div className="text-center basis-1/2">
            <div className="text-[#5DAFB0] font-bold text-lg ml-2">یا</div>
            <div className="font-bold">مستاجر اجاره رو نداد</div>
            <div className="font-light text-sm">اون موقع املاین پرداخت میکنه</div>
          </div>

          <div className="text-center basis-1/2">
            <div className="text-[#5DAFB0] font-bold text-lg">یا</div>
            <div className="font-bold">مستاجر اجاره رو داد</div>
            <div className="font-light text-sm">که عالیه!</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowCreateContract
