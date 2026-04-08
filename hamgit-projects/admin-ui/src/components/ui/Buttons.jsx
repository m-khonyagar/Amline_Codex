import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/solid'
import Button from './Button'

export const InsertButton = ({
  label,
  size = 'sm',
  color = 'blue',
  onClick,
  variant = '',
  styles = '',
  withIcon = true,
}) => {
  return (
    <Button
      type="button"
      color={color}
      size={size}
      className={styles}
      variant={variant}
      onClick={onClick}
    >
      {withIcon && <PlusIcon className="h-5 w-5 me-4" />}
      {label}
    </Button>
  )
}

export const UpdateButton = ({
  label,
  size = 'sm',
  color = 'green',
  onClick,
  variant = '',
  styles = '',
}) => {
  return (
    <Button
      type="button"
      color={color}
      size={size}
      className={styles}
      variant={variant}
      onClick={onClick}
    >
      <PencilSquareIcon className="h-5 w-5 me-4" />
      {label}
    </Button>
  )
}
