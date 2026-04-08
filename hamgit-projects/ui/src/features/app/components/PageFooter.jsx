import PropTypes from 'prop-types'
import { supportPhones } from '@/features/home'
import ShowMore from '@/components/ui/ShowMore'

export default function PageFooter({ descriptionTitle, children, isEitaa = false }) {
  return (
    <footer className="mx-4 pt-3 pb-20 flex flex-col gap-6 fa border-t">
      <div className="text-gray-700 text-sm">
        تلفن پشتیبانی:
        <span>
          {supportPhones.map((phone) => (
            <a
              dir="ltr"
              key={phone.value}
              href={`tel:${phone.value}`}
              className="px-3 border-l last:border-0 border-gray-500"
            >
              {phone.text}
            </a>
          ))}
        </span>
      </div>
      <div>
        {descriptionTitle && <strong className="text-sm">{descriptionTitle}</strong>}
        {children &&
          (isEitaa ? <div>{children}</div> : <ShowMore className="pt-1">{children}</ShowMore>)}
      </div>
    </footer>
  )
}

PageFooter.propTypes = {
  descriptionTitle: PropTypes.string,
  children: PropTypes.node,
  isEitaa: PropTypes.bool,
}
