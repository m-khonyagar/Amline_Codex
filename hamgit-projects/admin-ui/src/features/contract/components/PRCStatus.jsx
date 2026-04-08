import { Badge } from '@/components/ui/Badge'
import {
  contractStatusOptions,
  PRContractStateOptions,
  statusTypeEnum,
} from '@/data/enums/prcontract-enums'
import { findOption } from '@/utils/enum'

function PRCStatus({ status, state }) {
  const defaultOption = {
    value: status,
    label: status,
    type: statusTypeEnum.DEFAULT,
  }
  const statusOption = contractStatusOptions.find((i) => i.value === status) || defaultOption
  const stateOption = findOption(PRContractStateOptions, state)

  return (
    <Badge variant={statusOption.type?.variant}>
      {statusOption.label}
      {stateOption ? ` - ${stateOption.label}` : ''}
    </Badge>
  )
}
export default PRCStatus
