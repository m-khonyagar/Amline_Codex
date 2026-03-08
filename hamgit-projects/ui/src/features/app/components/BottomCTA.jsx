import cx from 'clsx'

function BottomCTA({ children, transparent = false, className }) {
  return (
    <div
      className={cx(
        'fixed max-w-2xl left-1/2 -translate-x-1/2 bottom-0 w-full py-4 z-[50]',
        transparent ? 'bg-transparent' : 'bg-white',
        className
      )}
    >
      <div className="px-4">{children}</div>
    </div>
  )
}

export default BottomCTA
