import { formatDate } from '@/utils/date'
import { translateEnum } from '@/utils/enum'
import { formatAmount, toPersianNumber } from '@/utils/number'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

const Field = ({ label, value, styles = '', required = false }) => {
  return (
    <div className={styles}>
      <strong className="me-2">
        {required && !value && <span className="text-red-500">*</span>}
        {label}:
      </strong>
      <span>{value ?? '-'}</span>
    </div>
  )
}

const StatusIcon = ({ value, style = { width: 'w-6', height: 'w-6' } }) => {
  return (
    <div className="flex items-center">
      {value ? (
        <CheckCircleIcon className={`text-green-500 ${style.width} ${style.height}`} />
      ) : (
        <XCircleIcon className={`text-red-500 ${style.width} ${style.height}`} />
      )}
    </div>
  )
}

export const DateField = ({ label, value, required = false, styles = '' }) => {
  return Field({ label, value: value ? formatDate(value) : null, required, styles })
}

export const NumberField = ({ label, value, required = false, styles = '' }) => {
  return Field({ label, value: value ? toPersianNumber(value) : '-', required, styles })
}

export const AmountField = ({ label, value, required = false, styles = '' }) => {
  return Field({ label, value: value ? formatAmount(value) : '-', required, styles })
}

export const TextField = ({ label, value, required = false, styles = '' }) => {
  return Field({ label, value, required, styles })
}

export const EnumField = ({ label, value, options = [], required = false, styles = '' }) => {
  return Field({ label, value: value ? translateEnum(options, value) : '-', required, styles })
}

export const ListEnumField = ({ label, value, options = [], required = false, styles = '' }) => {
  const strEnums = value ? value.map((item) => translateEnum(options, item)).join(', ') : '-'
  return Field({ label, value: strEnums, required, styles })
}

export const BooleanField = ({ value, label, required = false, styles = '' }) => {
  return Field({ label, value: <StatusIcon value={value} />, required, styles: `flex ${styles}` })
}

export const CityField = ({ value, label, required = false, styles = '' }) => {
  const city = value ? `${value?.name} ( ${value?.province} )` : null
  return Field({ label, value: city, required, styles })
}
