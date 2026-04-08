import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { HeaderNavigation } from '@/features/app'
import AdForm from '../components/AdForm'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useForm } from '@/components/ui/Form'
import useGetCities from '../../common/api/get-cities'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import useCreateAd from '../api/create-ad'
import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'
import useGetAd from '../api/get-ad'
import useEditAd from '../api/edit-ad'
import Button from '@/components/ui/Button'
import AdPreview from '../components/AdPreview'
import { adTypePaths } from '../constants'
import { toArrayLocation, toObjectLocation } from '../libs/convertLocation'

const defaultValues = {
  title: '',
  city_id: '',
  district_id: '',
  images: [],
  location: undefined,
  deposit_amount: '',
  rent_amount: '',
  sale_price: '',
  description: '',
  type: '',
  district: {},
  dynamic_amounts: false,
  property_info: {
    property_type: '',
    area: '',
    build_year: '',
    is_rebuilt: false,
    number_of_rooms: '',
    other_facilities: [],
    parking: false,
    storage_room: false,
    elevator: false,
  },
}

export default function EditAdPage() {
  const router = useRouter()
  const isEditMode = router.asPath.includes('/edit/')
  const isRental = router.query.type === adTypePaths.FOR_RENT
  const editingItemId = router.query.adId
  const step = router.query.step || ''

  const [previewData, setPreviewData] = useState()

  const createAdMutation = useCreateAd()
  const adQuery = useGetAd(editingItemId, {
    enabled: router.isReady && isEditMode,
  })
  const editAdMutation = useEditAd(editingItemId)
  const citiesQuery = useGetCities()

  const methods = useForm({
    defaultValues,
    values: {
      ...pickWithDefaults(
        {
          ...adQuery.data,
          location: toArrayLocation(adQuery.data?.location),
        },
        defaultValues
      ),
      property_info: pickWithDefaults(
        {
          ...adQuery.data?.property,
          build_year: adQuery.data?.property?.build_year
            ? `${adQuery.data?.property?.build_year?.toString()}-06-01`
            : null,
        },
        defaultValues.property_info
      ),
    },
  })

  const loading = useMemo(
    () => createAdMutation.isPending || editAdMutation.isPending,
    [createAdMutation.isPending, editAdMutation.isPending]
  )

  const setStep = (value) => {
    router.push({ query: { ...router.query, step: value } })
  }

  const handleCreate = (submissionData) => {
    createAdMutation.mutate(submissionData, {
      onSuccess: () => {
        router.replace({ pathname: '/ads/publish-status', query: { ad_type: router.query.type } })
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  const handleEdit = (submissionData) => {
    editAdMutation.mutate(submissionData, {
      onSuccess: () => {
        router.replace('/ads/publish-status')
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
      type: isRental ? AdPropertyTypeEnums.FOR_RENT : AdPropertyTypeEnums.FOR_SALE,
      deposit_amount: isRental ? Number(data.deposit_amount) : undefined,
      rent_amount: isRental ? Number(data.rent_amount) : undefined,
      sale_price: isRental ? undefined : Number(data.sale_price),
      district_id: data.district.id,
      district: undefined,
      location: data.location ? toObjectLocation(data.location) : null,
      image_file_ids: data.images.map((i) => i.uploadResponse?.data?.id || i.id),
      images: undefined,
      property_info: {
        ...data.property_info,
        area: Number(data.property_info.area),
        build_year: data.property_info.build_year
          ? new Date(data.property_info.build_year).getFullYear()
          : null,
        number_of_rooms:
          data.property_info.number_of_rooms === 'بدون اتاق'
            ? 0
            : Number(data.property_info.number_of_rooms),
      },
    }

    if (isEditMode) {
      handleEdit(submissionData)
    } else {
      handleCreate(submissionData)
    }
  }
  const generatePreviewData = () => {
    const data = methods.getValues()

    setPreviewData({
      ...data,
      type: isRental ? AdPropertyTypeEnums.FOR_RENT : AdPropertyTypeEnums.FOR_SALE,
      city: citiesQuery.data?.find((item) => item.id === methods.getValues('city_id')),
      property: data.property_info,
      images: data.images.map((i) => i.uploadResponse?.data || i),
      location: data.location ? toObjectLocation(data.location) : null,
    })
  }
  const completeFormStep = (data) => {
    saveData(data)
    generatePreviewData()
  }
  const onPreview = (data) => {
    generatePreviewData(data)
    setStep('preview')
  }

  useEffect(() => {
    if (step && !previewData) {
      router.replace({ query: { ...router.query, step: null } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <>
      <HeaderNavigation title={isEditMode ? 'ویرایش آگهی' : 'ثبت آگهی'} />

      {step === '' && (
        <LoadingAndRetry query={isEditMode && adQuery} loadingClassName="p-6">
          <AdForm
            defaultValues={defaultValues}
            onDone={completeFormStep}
            methods={methods}
            isRental={isRental}
            isEditMode={isEditMode}
            loading={loading}
            onPreview={onPreview}
          />
        </LoadingAndRetry>
      )}

      {step === 'preview' && previewData && (
        <AdPreview ad={previewData}>
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
              {isEditMode ? 'بروزرسانی آگهی' : 'انتشار آگهی'}
            </Button>
          </div>
        </AdPreview>
      )}
    </>
  )
}
