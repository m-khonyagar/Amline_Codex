import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/dom'

const generateLabels = (max) => {
  const labels = [
    {
      label: 'بدون اتاق',
      value: 0,
    },
    {
      label: '1',
      value: 1,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
    {
      label: '4',
      value: 4,
    },
  ]
  if (max > 4) {
    labels.push({
      label: '4+',
      value: 5,
    })
  }
  return labels
}

function RoomSelection({ value, onChange, maxRooms, require = false }) {
  const [selectedRooms, setSelectedRooms] = useState(null)

  const handleSelection = (rooms) => {
    const _value = selectedRooms === rooms ? null : rooms
    if (require && selectedRooms === rooms) return

    setSelectedRooms(_value)
    onChange?.(_value)
  }

  useEffect(() => {
    setSelectedRooms(value)
  }, [value])

  return (
    <div className="flex gap-2">
      {generateLabels(maxRooms).map((item) => (
        <Button
          key={item.value}
          className={cn(
            `fa border-2 rounded-lg p-5 h-1 text-slate-400`,
            selectedRooms === item.value ? 'border-2 border-primary text-primary' : ''
          )}
          onClick={() => handleSelection(item.value)}
          variant="ghost"
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}

RoomSelection.propTypes = {
  onChange: PropTypes.func,
  maxRooms: PropTypes.number.isRequired,
  require: PropTypes.bool,
}

export default RoomSelection
