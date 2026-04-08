import Button from '@/components/ui/Button'
import Error404 from '../components/Error404'

function DefaultErrorComponent({ reset }) {
  return (
    <div className="my-auto flex flex-col gap-5 justify-center items-center">
      <p>خطایی رخ داد، لطفا مجددا تلاش کنید و یا با پشتیبانی تماس بگیرید</p>

      <Button variant="link" onClick={reset}>
        تلاش مجدد
      </Button>
    </div>
  )
}

const errorPages = {
  404: Error404,
}

function ErrorPage({ error, resetErrorBoundary }) {
  const statusCode = error?.code
  const ErrorComponent = errorPages[statusCode] || DefaultErrorComponent

  // console.log(props)
  return <ErrorComponent reset={resetErrorBoundary} />
}

export default ErrorPage
