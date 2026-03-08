import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'

/**
 * A clickable navigation item component that displays an image and title
 * @param {Object} props - Component props
 * @param {string} props.imageSrc - The image src
 * @param {string} props.title - Text title displayed below the image
 * @param {string} props.href - URL or path for the link
 * @param {string} [props.rel] - Optional rel attribute for the link
 * @returns {React.ReactElement} A Link component with image and title
 */

export default function InquiryActionItem({ imageSrc, title, href, rel }) {
  return (
    <Link className="flex w-[66px] flex-col items-center gap-2 p-0.5" href={href} rel={rel}>
      <div className="flex size-[65px] items-center justify-center rounded-full shadow-md bg-white">
        <Image width={42} height={42} src={imageSrc} alt={title} />
      </div>
      <p className="text-xs text-center">{title}</p>
    </Link>
  )
}

InquiryActionItem.propTypes = {
  imageSrc: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  rel: PropTypes.string,
}
