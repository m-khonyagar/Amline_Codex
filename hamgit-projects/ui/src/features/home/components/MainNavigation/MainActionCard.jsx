import Image from 'next/image'
import Link from 'next/link'
import PropTypes from 'prop-types'

/**
 * MainActionCard - A navigational card component that displays an icon, title, subtitle
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.imageSrc - The main image to display in the card
 * @param {string} props.title - The title text of the card
 * @param {string} props.href - The destination URL for the card link
 * @returns {React.ReactElement} A link containing the card content
 */
export default function MainActionCard({ imageSrc, title, href }) {
  return (
    <Link
      href={href}
      className="relative w-full flex flex-col items-center gap-2.5 rounded-2xl bg-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)] px-3 pb-2"
    >
      <Image width={50} height={50} src={imageSrc} alt={title} />
      <h3 className="text-black text-center text-xs">{title}</h3>
    </Link>
  )
}

MainActionCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}
