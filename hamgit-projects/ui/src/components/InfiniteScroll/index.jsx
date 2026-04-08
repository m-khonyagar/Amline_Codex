import PropTypes from 'prop-types'
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactInfiniteScrollComponent from 'react-infinite-scroller'
import { CircleLoadingIcon } from '../icons'

function LoadingDefaultComponent() {
  return (
    <div className="flex justify-center items-center p-3 text-primary">
      <CircleLoadingIcon className="animate-spin" />
    </div>
  )
}

export default function InfiniteScroll({
  hasMore,
  children,
  fetchMore,
  threshold = 200,
  hasError = false,
  isReverse = false,
  LoadingComponent = LoadingDefaultComponent,
}) {
  return (
    <ReactInfiniteScrollComponent
      loadMore={fetchMore}
      hasMore={!hasError && hasMore}
      threshold={threshold}
      loader={<LoadingComponent />}
      isReverse={isReverse}
    >
      {children}
    </ReactInfiniteScrollComponent>
  )
}

InfiniteScroll.propTypes = {
  isReverse: PropTypes.bool,
  threshold: PropTypes.number,
  LoadingComponent: PropTypes.func,
  hasMore: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired,
}
