/* eslint-disable @next/next/no-img-element */
import cx from 'clsx'
import PropTypes from 'prop-types'

import { forwardRef, useEffect } from 'react'
import classes from './Image.module.scss'
import useFallbackRef from '@/hooks/use-fallback-ref'

const DEFAULT_IMAGE_URL =
  'https://statics.basalam.com/public-9/admin/ylMQL/06-25/sfjTC3xTzq79SYAdqmmy5pJBXNuw2XG1P3Ymqno4BCc8heDcAH.webp'

const Image = forwardRef(
  (
    {
      src,
      ratio,
      className,
      imageClass,
      lazy = false,
      alt = 'توضیحات تصویر',
      withPlaceHolder = true,
      emptyPlaceholder = DEFAULT_IMAGE_URL,
      errorPlaceholder = DEFAULT_IMAGE_URL,
    },
    forwardedRef
  ) => {
    const ref = useFallbackRef(forwardedRef)

    const onError = (e) => {
      if (e.currentTarget.src !== errorPlaceholder) {
        e.currentTarget.src = errorPlaceholder
      }
    }

    useEffect(() => {
      const image = ref.current
      const { complete, naturalHeight } = image

      // Img onError does not get triggered when using SSR
      // https://github.com/facebook/react/issues/15446
      // https://github.com/facebook/react/issues/12641
      if (complete && !naturalHeight) {
        // 1 - re-assign the src to trigger onError
        // image.src = `${image.src}?v=${Math.random()}`
        // 2 - or just change image src
        image.src = errorPlaceholder
      }
    }, [errorPlaceholder, ref])

    return (
      <div className={cx([classes.image, className])}>
        <img
          ref={ref}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          className={cx(classes.image__img, imageClass)}
          src={!src && withPlaceHolder ? emptyPlaceholder : src}
          onError={onError}
        />
        {ratio && <div style={{ paddingBottom: `${ratio * 100}%` }} />}
      </div>
    )
  }
)

Image.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  ratio: PropTypes.number,
  lazy: PropTypes.bool,
  className: PropTypes.string,
  imageClass: PropTypes.string,
  withPlaceHolder: PropTypes.bool,
  emptyPlaceholder: PropTypes.string,
  errorPlaceholder: PropTypes.string,
}
Image.displayName = 'Image'

export default Image
