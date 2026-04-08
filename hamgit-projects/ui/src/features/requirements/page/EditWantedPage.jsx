import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/components/ui/Form'
import { HeaderNavigation } from '@/features/app'
import useCreateRequirement from '../api/create-requirement'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import useGetRequirement from '../api/get-requirement'
import useEditRequirement from '../api/edit-requirement'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { pickWithDefaults } from '@/utils/object'
import useGetCities from '../../common/api/get-cities'
import { useAuthContext } from '@/features/auth'
// import NicknameStep from '../components/NicknameStep'
import WantedForm from '../components/WantedForm'
import WantedPreview from '../components/WantedPreview'

const defaultValues = {
  title: '',
  city_id: null,
  min_size: '',
  max_deposit: '',
  max_rent: '',
  sale_price: '',
  construction_year: '',
  description: '',
  room_count: 0,
  districts_list: [],
  property_type: [],
  elevator: false,
  parking: false,
  storage_room: false,
  tenant_deadline: '',
  type: '',
}

function EditWantedPage() {
  const router = useRouter()
  const { currentUser } = useAuthContext()
  const [previewData, setPreviewData] = useState(null)
  const [step, setStep] = useState('')

  const isEditMode = router.asPath.includes('/edit/')
  const isRental = router.asPath.includes('/rental')
  const editingItemId = router.query.requirementId

  const createRequirementMutation = useCreateRequirement()
  const requirementQuery = useGetRequirement(editingItemId, {
    enabled: router.isReady && isEditMode,
  })
  const { data: requirement } = requirementQuery

  const editRequirementMutation = useEditRequirement(editingItemId)
  const citiesQuery = useGetCities()

  const methods = useForm({
    defaultValues,
    values: pickWithDefaults(
      {
        ...requirement,
        construction_year: requirement?.construction_year
          ? `${requirement.construction_year}-06-01`
          : null,
      },
      defaultValues
    ),
  })

  const loading = useMemo(
    () => createRequirementMutation.isPending || editRequirementMutation.isPending,
    [createRequirementMutation.isPending, editRequirementMutation.isPending]
  )

  const handleSubmit = (submissionData) => {
    const mutation = isEditMode ? editRequirementMutation : createRequirementMutation
    mutation.mutate(submissionData, {
      onSuccess: () => {
        router.replace('/requirements/publish-status')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  const saveData = () => {
    const data = methods.getValues()
    const submissionData = {
      ...data,
      type: isRental ? RequirementTypeEnums.RENTAL : RequirementTypeEnums.BUY,
      min_size: Number(data.min_size),
      max_deposit: isRental ? Number(data.max_deposit) : undefined,
      max_rent: isRental ? Number(data.max_rent) : undefined,
      sale_price: isRental ? undefined : Number(data.sale_price),
      construction_year:
        isRental || !data.construction_year
          ? undefined
          : new Date(data.construction_year).getFullYear(),
      districts: data.districts_list.map((item) => item.id),
      districts_list: undefined,
      tenant_deadline: isRental ? data.tenant_deadline : null,
    }

    handleSubmit(submissionData)
  }

  const showPreview = () => {
    const data = methods.getValues()
    setPreviewData({
      ...data,
      type: isRental ? RequirementTypeEnums.RENTAL : RequirementTypeEnums.BUY,
      city: citiesQuery.data?.find((item) => item.id === methods.getValues('city_id')),
    })
    setStep('preview')
  }

  return (
    <>
      <HeaderNavigation title={isEditMode ? 'ویرایش نیازمندی' : 'ثبت نیازمندی'} />

      {step === '' && (
        <LoadingAndRetry query={isEditMode && requirementQuery} loadingClassName="p-6">
          <WantedForm
            defaultValues={defaultValues}
            onDone={saveData}
            onPreview={showPreview}
            methods={methods}
            isRental={isRental}
          />
        </LoadingAndRetry>
      )}

      {/* {step === 'nickname' && (
        <NicknameStep
          onDone={saveData}
          onClose={() => setStep('preview')}
          loading={loading}
          defaultNickName={currentUser?.nick_name}
        />
      )} */}

      {step === 'preview' && previewData && (
        <WantedPreview requirement={previewData} defaultNickName={currentUser?.nick_name}>
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
        </WantedPreview>
      )}
    </>
  )
}

export default EditWantedPage
