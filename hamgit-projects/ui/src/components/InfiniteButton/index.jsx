import { useInView } from 'react-intersection-observer'
import Button from '../ui/Button'
import { CircleLoadingIcon } from '../icons'

function InfiniteButton({ onLoad, loading, disabled }) {
  const { ref } = useInView({
    rootMargin: '-100px',

    onChange: (inView) => {
      if (inView) onLoad?.()
    },
  })

  if (disabled) return null

  return (
    <div ref={ref} className="w-full flex items-center justify-center h-14">
      {loading ? (
        <CircleLoadingIcon className="animate-spin" />
      ) : (
        <Button variant="link" onClick={() => onLoad?.()}>
          بیشتر
        </Button>
      )}
    </div>
  )
}

export default InfiniteButton
