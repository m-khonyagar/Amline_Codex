import { Page } from '@/features/misc'
import NewContract from '../components/NewContract/NewContract'
import NewContractRealtor from '../components/NewContractRealtor'
import { PermissionGuard } from '@/components/guards/PermissionGuard'
import { useAuthContext } from '@/features/auth'
import { SkeletonLoading } from '@/components/LoadingAndRetry'

const NewContractPage = () => {
  const { isLoadingCurrentUser } = useAuthContext()

  if (isLoadingCurrentUser) {
    return (
      <Page title="ایجاد قرارداد">
        <SkeletonLoading />
      </Page>
    )
  }

  return (
    <Page title="ایجاد قرارداد">
      <PermissionGuard requiredRoles={['CONTRACT_ADMIN']} fallback={<NewContract />}>
        <NewContractRealtor />
      </PermissionGuard>
    </Page>
  )
}

export default NewContractPage
