import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Page } from '@/features/misc'
import { useState } from 'react'
import { SendInvoiceLink } from '..'
import CreateCustomInvoice from '../components/CreateCustomInvoice/CreateCustomInvoice'
import CustomInvoiceList from '../components/CustomInvoiceList/CustomInvoiceList'

const CustomInvoiceListPage = () => {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false)
  const [invoiceLinkData, setInvoiceLinkData] = useState(null)

  return (
    <Page title="لینک‌های پرداخت">
      <div className="text-left mb-4">
        <Button size="sm" onClick={() => setIsOpenCreateDialog(true)}>
          ایجاد لینک پرداخت
        </Button>
      </div>

      <CustomInvoiceList />

      <Dialog
        open={isOpenCreateDialog}
        title="ایجاد لینک پرداخت"
        onOpenChange={(s) => setIsOpenCreateDialog(s)}
      >
        <CreateCustomInvoice
          onCancel={() => setIsOpenCreateDialog(false)}
          onSuccess={(data) => {
            setIsOpenCreateDialog(false)
            setInvoiceLinkData(data)
          }}
        />
      </Dialog>

      <Dialog
        open={invoiceLinkData}
        title="ارسال لینک پرداخت"
        onOpenChange={(s) => setInvoiceLinkData(s)}
      >
        <SendInvoiceLink
          data={invoiceLinkData}
          onCancel={() => setInvoiceLinkData(null)}
          onSuccess={() => setInvoiceLinkData(null)}
        />
      </Dialog>
    </Page>
  )
}

export default CustomInvoiceListPage
