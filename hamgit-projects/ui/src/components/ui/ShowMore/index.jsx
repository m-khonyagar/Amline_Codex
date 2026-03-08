import PropTypes from 'prop-types'
import { useState } from 'react'
import { cn } from '@/utils/dom'

import classes from './ReadMore.module.scss'
import { ChevronDownIcon } from '@/components/icons'

function ShowMore({ children, className, isOpen = false }) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen)

  return (
    <div className={cn(classes.container, className)}>
      <div className={cn(classes.text, localIsOpen ? '!h-full' : '')}>{children}</div>
      <button type="button" className={classes.btn} onClick={() => setLocalIsOpen(!localIsOpen)}>
        {localIsOpen ? 'بستن' : 'مشاهده بیشتر'}
        <div className={localIsOpen ? '-scale-100' : ''}>
          <ChevronDownIcon size={20} />
        </div>
      </button>
    </div>
  )
}

ShowMore.propType = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default ShowMore
