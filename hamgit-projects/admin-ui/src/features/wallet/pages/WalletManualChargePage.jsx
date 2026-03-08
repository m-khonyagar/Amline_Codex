import { Page } from '@/features/misc'
import WalletManualCharge from '../components/WalletManualCharge'
import WalletBulkManualCharge from '../components/WalletBulkManualCharge'

const WalletManualChargePage = () => {
  return (
    <Page title="شارژ کیف پول">
      <div className="flex flex-wrap gap-8">
        <div className="max-w-lg w-full">
          <WalletManualCharge className="bg-white rounded-lg p-4" />
        </div>

        <div className="max-w-lg w-full">
          <WalletBulkManualCharge className="bg-white rounded-lg p-4" />
        </div>
      </div>
    </Page>
  )
}

export default WalletManualChargePage
