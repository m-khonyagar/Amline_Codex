/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
function Modal({ open, onClose, children, className }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`
        fixed inset-0 cursor-default flex justify-center items-center transition-colors z-[100]
        ${open ? 'visible bg-black/20' : 'invisible'}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        className={`
          bg-white rounded-xl shadow p-6 transition-all
          ${open ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          ${className || ''}
        `}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
