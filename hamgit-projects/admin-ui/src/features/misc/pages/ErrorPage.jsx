import { Page } from '..'
import Button from '@/components/ui/Button'

const ErrorPage = ({ returnUrl = '/' }) => {
  return (
    <Page title="خطا">
      <div className="flex items-center flex-col py-20 justify-center">
        <div className="text-red-600 font-bold text-center max-w-lg mb-6">
          در انجام درخواست شما مشکلی به وجود آمده است. لطفاً دوباره تلاش کنید و در صورت تداوم مشکل،
          با تیم فنی تماس بگیرید.
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>

          <Button variant="danger" size="sm" href={returnUrl}>
            بازگشت
          </Button>
        </div>
      </div>
    </Page>
  )
}

export default ErrorPage
