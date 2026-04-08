import { ChevronRightIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import useBack from '@/hooks/use-back'
import SEO from '@/components/SEO'

function HeaderNavigation({ title, backUrl, href, backCount = 1, onBack, children, ...props }) {
  const { goBack } = useBack()

  const appTitle = title ? `املاین | ${title}` : ''

  return (
    <div className="bg-white w-full p-2 border-b">
      <div className="flex items-center gap-2">
        <Button
          href={href}
          onClick={() => {
            if (!href) {
              if (typeof onBack === 'function') {
                onBack()
              } else {
                goBack(backUrl, backCount)
              }
            }
          }}
          variant="ghost"
          size="sm"
        >
          <ChevronRightIcon />
        </Button>

        {appTitle && <SEO title={appTitle} {...props} />}
        {title && <h1>{title}</h1>}

        <div className="mr-auto">{children}</div>
      </div>
    </div>
  )
}

export default HeaderNavigation
