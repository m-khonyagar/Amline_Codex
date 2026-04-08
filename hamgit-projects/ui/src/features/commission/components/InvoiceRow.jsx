import { TomanIcon } from '@/components/icons'
import { numberSeparator, toPersianNumber } from '@/utils/number'

export default function InvoiceRow({ title, price, isLast, buyingOption, isDiscount }) {
  const classNameLast = 'flex text-sm  justify-between bg-green-50 rounded-md p-2 '
  const classNameDefault = isDiscount
    ? 'flex justify-between text-sm  text-green-500  align-center'
    : 'flex justify-between text-sm   align-center'
  const typeRental = buyingOption === 'rental' ? 290000 : price * 0.4
  const percent = buyingOption === 'rental' ? '' : '۶۰ %'

  return (
    <div className={isLast ? classNameLast : classNameDefault}>
      {isLast ? (
        <div className="flex items-center gap-1 ">
          <p className="text-xs ">{title}</p>
          <span className="text-green-500 text-xs "> {percent} تخفیف </span>
        </div>
      ) : (
        <p>{title} </p>
      )}
      <p className="flex items-center">
        {isLast ? (
          <div className="flex items-center">
            {/* <span className={`text-xs ml-1 text-gray-500  ${isLast ? 'line-through' : ''}`}>
              {toPersianNumber(numberSeparator(price))}l
            </span> */}
            <span className="text-green-500 font-bold">
              {toPersianNumber(numberSeparator(typeRental))}
            </span>
          </div>
        ) : (
          <span className={`font-bold ${isLast ? 'line-through' : ''} `}>
            {toPersianNumber(numberSeparator(price))}
            {isDiscount ? '-' : ' '}
          </span>
        )}
        <TomanIcon />
      </p>
    </div>
  )
}
