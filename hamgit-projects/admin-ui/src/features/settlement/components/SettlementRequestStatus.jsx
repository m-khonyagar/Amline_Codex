import { findOption } from '@/utils/enum'
import { Badge } from '@/components/ui/Badge'
import { SettlementStatusOptions } from '@/data/enums/settlement_status_enums'

function SettlementRequestStatus({ status }) {
  const statusOption = findOption(SettlementStatusOptions, status)

  return <Badge variant={statusOption?.variant}>{statusOption?.label}</Badge>
}
export default SettlementRequestStatus
