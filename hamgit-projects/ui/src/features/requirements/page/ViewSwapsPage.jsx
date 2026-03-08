import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useGetSwap from '../api/get-swap'
import SwapsPreview from '../components/SwapsPreview'
import { HeaderNavigation } from '@/features/app'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useDeleteSwap from '../api/delete-swap'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { useAuthContext } from '@/features/auth'

export default function ViewSwapsPage() {
  const router = useRouter()
  const { swapId } = router.query

  const swapQuery = useGetSwap(swapId, {
    enabled: router.isReady,
  })

  const { currentUser } = useAuthContext()

  const isEditable = useMemo(
    () => currentUser?.id === swapQuery?.data?.user_id,
    [currentUser, swapQuery?.data]
  )

  const deleteSwapMutation = useDeleteSwap()
  const handleDelete = () => {
    deleteSwapMutation.mutate(swapId, {
      onSuccess: () => {
        router.replace('/profile/my-requirements')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }
  const handleEdit = () => {
    router.push(`/requirements/swaps/${swapId}/edit`)
  }

  return (
    <div>
      <HeaderNavigation title="نیازمندی ها" />

      <LoadingAndRetry query={swapQuery} loadingClassName="p-7">
        <SwapsPreview requirement={swapQuery.data}>
          {isEditable && (
            <div className="flex gap-2 px-2">
              <Button
                className="w-full"
                onClick={handleEdit}
                disabled={deleteSwapMutation.isPending}
              >
                ویرایش
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDelete}
                disabled={deleteSwapMutation.isPending}
              >
                حذف
              </Button>
            </div>
          )}
        </SwapsPreview>
      </LoadingAndRetry>
    </div>
  )
}
