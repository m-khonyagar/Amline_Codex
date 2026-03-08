import { useEffect } from 'react'
import { useRouter } from 'next/router'

function ViewContractPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/contracts')
  }, [router])
  return null
}

export default ViewContractPage
