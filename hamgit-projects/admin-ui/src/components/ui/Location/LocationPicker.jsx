import 'leaflet/dist/leaflet.css'
import PropTypes from 'prop-types'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { LocationBoldIcon } from '@/components/icons'
import classes from './LocationPicker.module.scss'

const _defaultPosition = [34.6416, 50.8746]

function LocationPicker({ position, defaultPosition, pickerRef, onChange, height = '420px' }) {
  const [map, setMap] = useState()
  const [_position, setPosition] = useState(position || defaultPosition || _defaultPosition)

  const onMove = useCallback(() => {
    const { lat, lng } = map.getCenter()
    setPosition([lat, lng])
    onChange?.([lat, lng])
  }, [map, onChange])

  useEffect(() => {
    if (map) {
      map.on('move', onMove)
    }

    return () => {
      map?.off('move', onMove)
    }
  }, [onMove, map])

  useImperativeHandle(pickerRef, () => ({
    getPosition: () => _position,
  }))

  return (
    <div>
      <MapContainer
        zoom={16}
        ref={setMap}
        center={_position}
        zoomControl
        scrollWheelZoom
        className={classes['map-container']}
        style={{ height }}
      >
        <div className={classes['map-marker']}>
          <LocationBoldIcon className={classes['map-marker__pin']} size={70} />
        </div>

        <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <TileLayer attribution="" url="https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png" /> */}
        {/* <TileLayer attribution="" url="https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png" /> */}
      </MapContainer>
    </div>
  )
}

LocationPicker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number), // Array of lat, lng
  defaultPosition: PropTypes.arrayOf(PropTypes.number), // Array of lat, lng
  pickerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]), // Ref can be a function or an object
  onChange: PropTypes.func, // Function to handle position changes
}

export default LocationPicker
