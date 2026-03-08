import { forwardRef, useRef, useState } from 'react'
import Button from '../Button'
import DrawerModal from '../DrawerModal'
import { LocationIcon } from '@/components/icons'
import NextLocationPicker from './NextLocationPicker'
import NextLocationPreview from './NextLocationPreview'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import mapPlaceholderImg from './map-placeholder.png'

const LocationPickerInput = forwardRef(
  ({ value, onChange, defaultValue, label, previewHeight = '160px', className }, _ref) => {
    const pickerRef = useRef()

    const [isShow, setIsShow] = useState(false)

    const [localValue, setLocalValue] = useUncontrolled({
      value,
      onChange,
      defaultValue,
      // finalValue: new Date(),
    })

    const handleSubmit = () => {
      const position = pickerRef.current?.getPosition()

      if (position) {
        setLocalValue(position)

        setIsShow(false)
      }
    }

    return (
      <div className={className}>
        {label && (
          <label className="block mb-2" htmlFor="location">
            {label}
          </label>
        )}

        {localValue ? (
          <NextLocationPreview
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
            style={{ height: previewHeight, backgroundImage: `url(${mapPlaceholderImg.src})` }}
          >
            <LocationIcon size={24} />
            {label || 'انتخاب موقعیت مکانی'}
          </div>
        )}

        <DrawerModal pure show={isShow} dismissible={false} handleClose={() => setIsShow(false)}>
          <NextLocationPicker
            pickerRef={pickerRef}
            position={localValue}
            defaultPosition={defaultValue}
          />

          <div className="grid grid-cols-2 gap-3 py-5 px-6">
            <Button className="w-full" type="button" onClick={handleSubmit}>
              تایید
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsShow(false)}
            >
              انصراف
            </Button>
          </div>
        </DrawerModal>
      </div>
    )
  }
)

export default LocationPickerInput
