import { useRef, useState } from 'react'
import Button from '../Button'
import { Dialog } from '../Dialog'
import { LocationIcon } from '@/components/icons'
import LocationPicker from './LocationPicker'
import LocationPreview from './LocationPreview'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import mapPlaceholderImg from './map-placeholder.png'

function LocationPickerInput({ value, onChange, defaultValue, label, previewHeight = '160px' }) {
  const pickerRef = useRef()

  const [isShow, setIsShow] = useState(false)

  const [localValue, setLocalValue] = useUncontrolled({
    value,
    onChange,
    defaultValue,
  })

  const handleSubmit = () => {
    const position = pickerRef.current?.getPosition()

    if (position) {
      setLocalValue(position)
      setIsShow(false)
    }
  }

  return (
    <div>
      {label && (
        <label className="block mb-2" htmlFor="location">
          {label}
        </label>
      )}

      {localValue ? (
        <LocationPreview
          height={previewHeight}
          position={localValue}
          onClick={() => setIsShow(true)}
        />
      ) : (
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => setIsShow(true)}
          onClick={() => setIsShow(true)}
          className="flex gap-2 items-center justify-center border-2 border-gray-200 rounded-lg text-gray-500 cursor-pointer bg-center bg-cover"
          style={{ height: previewHeight, backgroundImage: `url(${mapPlaceholderImg})` }}
        >
          <LocationIcon size={24} />
          {label || 'انتخاب موقعیت مکانی'}
        </div>
      )}

      <Dialog open={isShow} onOpenChange={() => setIsShow(false)}>
        <LocationPicker
          pickerRef={pickerRef}
          position={localValue}
          defaultPosition={defaultValue}
        />

        <div className="grid grid-cols-3 gap-3 py-5 px-6">
          <Button
            type="button"
            variant="danger"
            className="w-full"
            onClick={() => {
              setLocalValue(undefined)
              setIsShow(false)
            }}
          >
            حذف
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsShow(false)}
          >
            انصراف
          </Button>

          <Button className="w-full" type="button" onClick={handleSubmit}>
            تایید
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default LocationPickerInput
