import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { cn } from '@/utils/dom'
import { trimText } from '@/utils/string'

import classes from './ReadMore.module.scss'

function ReadMore({ text, className, min = 150, max = 250, ideal = 200, isOpen = false }) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen)

  const [brief, secondPart] = useMemo(
    () => trimText(text, min, ideal, max),
    [text, min, ideal, max]
  )
  const isSame = brief?.length === text?.length

  return (
    <div className={classes.container}>
      <p className={cn(className, classes.text)}>
        {isSame && text}
        {!isSame && (localIsOpen ? `${brief} ${secondPart}` : `${brief} ...`)}

        {!isSame && (
          <button
            type="button"
            className={classes.btn}
            onClick={() => setLocalIsOpen(!localIsOpen)}
          >
            <span className="bs-read-more__btn-title">{localIsOpen ? 'بستن' : 'ادامه'}</span>
          </button>
        )}
      </p>
    </div>
  )
}

ReadMore.propType = {
  min: PropTypes.number,
  max: PropTypes.number,
  isOpen: PropTypes.bool,
  text: PropTypes.string,
  ideal: PropTypes.number,
  className: PropTypes.string,
}

export default ReadMore
