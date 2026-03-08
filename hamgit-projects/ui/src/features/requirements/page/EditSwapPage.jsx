import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { HeaderNavigation } from '@/features/app'
import { handleErrorOnSubmit } from '@/utils/error'
import useCreateSwap from '../api/create-swap'
import useGetSwap from '../api/get-swap'
import useEditSwap from '../api/edit-swap'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { pickWithDefaults } from '@/utils/object'
import SwapForm from '../components/SwapForm'
import NicknameStep from '../components/NicknameStep'
import SwapsPreview from '../components/SwapsPreview'
import { useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { useAuthContext } from '@/features/auth'

function EditSwapPage() {
  const router = useRouter()
  const isEditMode = router.asPath.includes('/edit')
  const editingItemId = router.query.swapId
  const { currentUser } = useAuthContext()

  const [previewData, setPreviewData] = useState()

  const step = router.query.step || ''

  const setStep = (value) => {
    router.push({ query: { ...router.query, step: value } })
  }

  const createSwapMutation = useCreateSwap()
  const editSwapMutation = useEditSwap(editingItemId)

  const swapQuery = useGetSwap(editingItemId, {
    enabled: router.isReady && isEditMode,
  })

  const defaultValues = pickWithDefaults(swapQuery.data, {
    title: '',
    price: null,
    have: '',
    want: '',
  })

  const methods = useForm({
    values: defaultValues,
  })

  const handleCreate = (submissionData) => {
    createSwapMutation.mutate(submissionData, {
      onSuccess: () => {
        router.replace('/requirements/publish-status')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  const handleEdit = (submissionData) => {
    editSwapMutation.mutate(submissionData, {
      onSuccess: () => {
        router.replace('/requirements/publish-status')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  const saveData = () => {
    if (isEditMode) {
      handleEdit(previewData)
    } else {
      handleCreate(previewData)
    }
  }
  const completeFormStep = (data) => {
    setPreviewData(data)
    setStep('nickname')
  }
  const completeNicknameStep = () => {
    saveData()
  }

  const loading = useMemo(
    () => createSwapMutation.isPending || editSwapMutation.isPending,
    [createSwapMutation.isPending, editSwapMutation.isPending]
  )

  useEffect(() => {
    if (step && !previewData) {
      router.replace({ query: { ...router.query, step: null } })
    }
  }, [previewData, router, step])

  return (
    <>
      <HeaderNavigation title={isEditMode ? 'ویرایش نیازمندی' : 'ثبت نیازمندی'} />

      {step === '' && (
        <LoadingAndRetry query={isEditMode && swapQuery} loadingClassName="p-6">
          <SwapForm defaultValues={defaultValues} onDone={completeFormStep} methods={methods} />
        </LoadingAndRetry>
      )}

      {step === 'nickname' && (
        <NicknameStep
          onDone={completeNicknameStep}
          onClose={() => setStep('preview')}
          loading={loading}
        />
      )}

      {step === 'preview' && previewData && (
        <SwapsPreview requirement={previewData} defaultNickName={currentUser?.nick_name}>
          <div className="flex gap-2 px-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('')}
              disabled={loading}
            >
              ویرایش
            </Button>
            <Button className="w-full" onClick={saveData} loading={loading}>
              انتشار نیازمندی
            </Button>
          </div>
        </SwapsPreview>
      )}
    </>
  )
}

export default EditSwapPage
