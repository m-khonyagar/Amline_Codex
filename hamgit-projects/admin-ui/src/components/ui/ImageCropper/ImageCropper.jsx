import React, { useRef, useImperativeHandle, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { cn } from '@/utils/dom'
import 'react-image-crop/dist/ReactCrop.css'
import classes from './ImageCropper.module.scss'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const ImageCropper = React.forwardRef(({ imageSrc, className, aspect, ...props }, ref) => {
  const imgRef = useRef(null)
  const [crop, setCrop] = useState(null)
  const [completedCrop, setCompletedCrop] = useState(null)

  const generateCroppedImage = useCallback(
    (fileName, fileType) => {
      if (!imgRef.current || !completedCrop) return null

      const image = imgRef.current
      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = completedCrop.width
      canvas.height = completedCrop.height
      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }

          const croppedImageFile = new File([blob], fileName, {
            type: fileType,
            lastModified: Date.now(),
          })

          const imageUrl = URL.createObjectURL(blob)

          resolve({ file: croppedImageFile, url: imageUrl })
        }, fileType)
      })
    },
    [completedCrop]
  )

  useImperativeHandle(ref, () => ({ generateCroppedImage }), [generateCroppedImage])

  const onImageLoad = (e) => {
    const width = e.currentTarget.naturalWidth
    const height = e.currentTarget.naturalHeight

    const defaultCrop = centerAspectCrop(width, height, aspect || width / height)

    const pixelCrop = {
      unit: 'px',
      x: (defaultCrop.x / 100) * width,
      y: (defaultCrop.y / 100) * height,
      width: (defaultCrop.width / 100) * width,
      height: (defaultCrop.height / 100) * height,
    }

    setCrop(defaultCrop)
    setCompletedCrop(pixelCrop)
  }

  return (
    <div className={classes['cropper-bg']}>
      <div className={classes.container}>
        <ReactCrop
          crop={crop}
          aspect={aspect}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          className={cn('max-h-[500px]', className)}
          {...props}
        >
          <img key={imageSrc} ref={imgRef} src={imageSrc} alt="Crop preview" onLoad={onImageLoad} />
        </ReactCrop>
      </div>
    </div>
  )
})

ImageCropper.displayName = 'ImageCropper'

ImageCropper.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  aspect: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  ruleOfThirds: PropTypes.bool,
  circularCrop: PropTypes.bool,
}

export default ImageCropper
