import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { LocationBoldIcon } from '@/components/icons'
import classes from './LocationPreview.module.scss'

function LocationPreview({
  onClick,
  className,
  position = [34.6416, 50.8746],
  zoom = 16,
  height = '160px',
}) {
  const [map, setMap] = useState()

  useEffect(() => {
    if (position) {
      // map?.panTo(position)
      map?.setZoom(zoom)
      map?.setView(position)
    }
  }, [position, map, zoom])

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onClick?.()}
      onKeyDown={() => onClick?.()}
      className={className}
    >
      <MapContainer
        zoom={zoom}
        ref={setMap}
        center={position}
        dragging={false}
        touchZoom={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{ height }}
        className={classes['map-container']}
      >
        <div className={classes['map-marker']}>
          <LocationBoldIcon className={classes['map-marker__pin']} size={36} />
        </div>

        <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <TileLayer attribution="" url="https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}.png" /> */}
      </MapContainer>
    </div>
  )
}

LocationPreview.propTypes = {
  zoom: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number), // Array of [lat, lng]
  onClick: PropTypes.func, // Function to handle click events
  className: PropTypes.string, // CSS class name
  height: PropTypes.string, // Height of the map container
}

export default LocationPreview
