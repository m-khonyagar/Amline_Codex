import React, { useState, useRef } from 'react'
import ImageCropper from './ImageCropper'
import Button from '../Button'

/** @type { import('@storybook/react').Meta } */
export default {
  component: ImageCropper,
  args: {
    aspect: 1,
    minWidth: 100,
    minHeight: 100,
    ruleOfThirds: true,
  },
}

/** @type { import('@storybook/react').StoryObj } */
export const Default = {
  render: (args) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const cropperRef = useRef()

    const handleGenerateCroppedImage = async () => {
      const { url } = await cropperRef.current.generateCroppedImage(
        'cropped-image.jpg',
        'image/jpeg'
      )
      setCroppedImage(url)
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageSrc(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }

    return (
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {imageSrc && (
          <div className="flex items-start gap-16">
            <div className="max-w-2xl flex flex-col gap-4">
              <ImageCropper {...args} ref={cropperRef} imageSrc={imageSrc} />
              <Button type="button" onClick={handleGenerateCroppedImage}>
                Generate Cropped Image
              </Button>
            </div>

            {croppedImage && (
              <div>
                <h3>Cropped Image:</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={croppedImage} alt="Cropped Result" />
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
  args: {},
}
