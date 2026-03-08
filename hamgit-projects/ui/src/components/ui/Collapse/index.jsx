import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { useCollapse } from './use-collapse'

const Collapse = forwardRef(
  (
    {
      children,
      className,
      in: opened,
      animateOpacity = true,
      transitionDuration = 200,
      transitionTimingFunction = 'ease',
      onTransitionEnd = () => {},
    },
    ref
  ) => {
    const duration = transitionDuration
    const getCollapseProps = useCollapse({
      opened,
      onTransitionEnd,
      transitionTimingFunction,
      transitionDuration: duration,
    })
    return (
      <div {...getCollapseProps({ style: {}, ref })}>
        <div
          className={className}
          style={{
            opacity: opened || !animateOpacity ? 1 : 0,
            transition: animateOpacity
              ? `opacity ${duration}ms ${transitionTimingFunction}`
              : 'none',
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

Collapse.propTypes = {
  children: PropTypes.node,
  in: PropTypes.bool.isRequired,
  animateOpacity: PropTypes.bool,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  onTransitionEnd: PropTypes.func,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}

export default Collapse
