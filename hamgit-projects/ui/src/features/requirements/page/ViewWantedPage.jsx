import { useRouter } from 'next/router'
import { useMemo } from 'react'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetRequirement from '../api/get-requirement'
import { HeaderNavigation } from '@/features/app'
import WantedPreview from '../components/WantedPreview'
import Button from '@/components/ui/Button'
import { useAuthContext } from '@/features/auth'
import useDeleteRequirement from '../api/delete-requirement'
import { handleErrorOnSubmit } from '@/utils/error'
import { RequirementTypeNameEnums } from '@/data/enums/requirement_type_enums'
import SimilarWantedAds from '../components/SimilarWantedAds'
import SimilarAds from '../components/SimilarAds'

function ViewWantedPage() {
  const router = useRouter()
  const { requirementId } = router.query
  const { currentUser } = useAuthContext()
  const requirementQuery = useGetRequirement(requirementId, { enabled: router.isReady })
  const requirement = useMemo(() => requirementQuery.data, [requirementQuery.data])

  const isEditable = useMemo(
    () => currentUser?.id === requirementQuery?.data?.user_id,
    [currentUser, requirementQuery?.data]
  )

  const deleteRequirementMutation = useDeleteRequirement()
  const handleDelete = () => {
    deleteRequirementMutation.mutate(requirementId, {
      onSuccess: () => {
        router.replace('/profile/my-requirements')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  const handleEdit = () => {
    router.push(
      `/requirements/edit/${RequirementTypeNameEnums[requirement?.type]}/${requirementId}`
    )
  }

  return (
    <>
      <HeaderNavigation title="نیازمندی ها" noIndex />
      <LoadingAndRetry query={requirementQuery} loadingClassName="p-7">
        {requirement && (
          <WantedPreview requirement={requirement}>
            {isEditable && (
              <div className="flex gap-2 px-2">
                <Button
                  className="w-full"
                  onClick={handleEdit}
                  disabled={deleteRequirementMutation.isPending}
                >
                  ویرایش
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDelete}
                  disabled={deleteRequirementMutation.isPending}
                >
                  حذف
                </Button>
              </div>
            )}
          </WantedPreview>
        )}
      </LoadingAndRetry>
      {requirement && (
        <div className="mb-20 mt-6 flex flex-col gap-6">
          <SimilarWantedAds wantedAdId={requirementId} />
          <SimilarAds wantedAdId={requirementId} />
        </div>
      )}
    </>
  )
}

export default ViewWantedPage
