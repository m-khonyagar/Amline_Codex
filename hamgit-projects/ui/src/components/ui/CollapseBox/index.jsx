import PropTypes from 'prop-types'
import classes from './CollapseBox.module.scss'
import Collapse from '../Collapse'
import { ChevronDownIcon } from '@/components/icons'
import { cn } from '@/utils/dom'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

function CollapseBox({
  label,
  children,
  className,
  labelClassName,
  contentClassName,
  defaultOpen = false,
  editButton,
  open,
  onToggle,
}) {
  const [localOpen, setLocalOpen] = useUncontrolled({
    value: open,
    defaultValue: defaultOpen,
    finalValue: false,
    onChange: onToggle,
  })

  const toggleCollapse = () => {
    setLocalOpen?.(!localOpen)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleCollapse()
    }
  }

  return (
    <div className={cn(classes['collapse-box'], className)}>
      <div
        tabIndex={0}
        onClick={toggleCollapse}
        onKeyDown={handleKeyDown}
        role="button"
        className={cn([classes['collapse-box__label'], labelClassName])}
      >
        <div>{label}</div>
        <div className="flex justify-center items-stretch gap-2">
          <div>{localOpen && <> {editButton}</>}</div>
          <ChevronDownIcon
            className={cn(classes['collapse-box__label__icon'], localOpen && 'rotate-180')}
          />
        </div>
      </div>
      <Collapse in={localOpen} className={cn([classes['collapse-box__content'], contentClassName])}>
        {children}
      </Collapse>
    </div>
  )
}

CollapseBox.propTypes = {
  label: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  editButton: PropTypes.node,
}

export default CollapseBox
