import React, { useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { cn } from '@/utils/dom'
import classes from './StoryViewer.module.scss'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'

export default function StoryViewer({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  return (
    <div className={classes['story-container']}>
      <div className={classes['story-slots']}>
        {stories.map((_, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={cn(classes['story-slots__item'], currentIndex !== i && 'opacity-50')}
          />
        ))}
      </div>

      <div className={classes['story-image']}>
        <Image
          sizes="(max-width: 1280px) 80vw, 50vw"
          src={stories[currentIndex].image}
          alt="Story"
          fill
        />
      </div>

      {stories[currentIndex].description && (
        <pre className={classes['story-description']}>{stories[currentIndex].description}</pre>
      )}

      <button
        type="button"
        aria-label="Previous"
        onClick={prevStory}
        disabled={currentIndex === 0}
        className={cn(classes['story-prev-btn'])}
      >
        <ChevronLeftIcon size={36} />
      </button>

      <button
        type="button"
        aria-label="Next"
        onClick={nextStory}
        disabled={currentIndex === stories.length - 1}
        className={cn(classes['story-next-btn'])}
      >
        <ChevronRightIcon size={36} />
      </button>
    </div>
  )
}

StoryViewer.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}
