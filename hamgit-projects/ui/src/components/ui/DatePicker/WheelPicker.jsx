import { cn } from '@/utils/dom'
import Wheel from './Wheel'

import classes from './DatePicker.module.scss'

function WheelPicker(props) {
  return (
    <div data-vaul-no-drag className={cn(classes['date-picker'], 'fa')}>
      <Wheel {...props} />
    </div>
  )
}

export default WheelPicker
