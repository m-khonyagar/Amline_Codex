import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { useContractLogic } from '@/features/contract'
import useBack from '@/hooks/use-back'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { getPropertyInformationSteps } from '../../libs/property-steps'
import { FileTypeEnums } from '@/data/enums/file_type_enums'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import ImageUploaderField from '@/components/ui/Form/ImageUploaderField'
import { Form, InputField, useForm, SelectField } from '@/components/ui/Form'
import { useUploadFile, useDownloadFile, SelectCityField } from '@/features/common'
import { propertyDeedStatusOptions, propertyTypesOptions } from '../../libs/property-constants'
import useGetContractStatus from '../../api/get-contract-status'
import useGetPrContractProperty from '../../api/get-pr-contract-property'
import usePatchPrContractsPropertySpecifications from '../../api/patch-pr-contracts-property-specifications'
import LoadingAndRetry from '@/components/LoadingAndRetry'

const defaultValues = {
  property_type: null,
  deed_status: null,
  deed_image_file_ids: [],
  city_id: '',
  registration_area: '',
  main_register_number: '',
  sub_register_number: '',
  postal_code: '',
  address: '',
  electricity_bill_id: '',
  family_members_count: '',
}

const calcBack = (statuses, contractId) => {
  const isCompletedAllSteps = getPropertyInformationSteps(statuses).every((s) => s.completed)
  const link = isCompletedAllSteps
    ? `/contracts/${contractId}/manage`
    : `/contracts/${contractId}/manage/property-information`

  return {
    url: link,
    count: isCompletedAllSteps ? 2 : 1,
  }
}

function PropertySpecificationsPage() {
  const router = useRouter()
  const { contractId } = router.query
  const { goBack } = useBack()

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const contractPropertyQuery = useGetPrContractProperty(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery
  const { data: contractProperty } = contractPropertyQuery
  const patchPropertySpecificationsMutation = usePatchPrContractsPropertySpecifications(contractId)
  const { signedByCurrentUser } = useContractLogic(statuses)

  const uploadMutation = useUploadFile({
    fileType: FileTypeEnums.PROPERTY_DEED,
  })
  const downloadFileMutation = useDownloadFile()
  const [uploadState, setUploadState] = useState()

  const methods = useForm({
    defaultValues,
    values: {
      ...pickWithDefaults(contractProperty, defaultValues),
      city_id: contractProperty?.city?.id || '',
      deed_image_file_ids: contractProperty?.deed_image_files || [],
    },
  })

  const backUrl = useMemo(() => calcBack(statuses, contractId).url, [contractId, statuses])
  const handleBack = (data) => {
    const { url, count } = calcBack(data || statuses, contractId)
    goBack(url, count)
  }

  const onSubmitSpecification = (data) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    patchPropertySpecificationsMutation.mutate(
      {
        ...data,
        main_register_number: data.main_register_number || null,
        sub_register_number: data.sub_register_number || null,
        deed_image_file_ids: data.deed_image_file_ids.map(
          (i) => i.uploadResponse?.data?.id || i.id
        ),
      },
      {
        onSuccess: () => {
          contractStatusQuery.refetch().then((res) => {
            handleBack(res.data)
          })
        },
        onError: (err) => {
          handleErrorOnSubmit(err, methods.setError, data)
        },
      }
    )
  }

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <div>
      <HeaderNavigation title="مشخصات ملک" backUrl={backUrl} />

      <div className="px-8 py-6">
        <LoadingAndRetry ignore404 query={[contractStatusQuery, contractPropertyQuery]}>
          <Form methods={methods} onSubmit={onSubmitSpecification} className="flex flex-col gap-2">
            <SelectField
              asValue
              required
              searchable
              name="property_type"
              label="نوع و کاربری ملک"
              options={propertyTypesOptions}
            />

            <SelectField
              asValue
              required
              label="وضعیت سند"
              name="deed_status"
              options={propertyDeedStatusOptions}
            />

            <ImageUploaderField
              required
              name="deed_image_file_ids"
              label="تصویر سند"
              uploadFileType={FileTypeEnums.PROPERTY_DEED}
              onUploadStateChange={setUploadState}
              downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
              uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
            />

            <SelectCityField required name="city_id" label="شهر" />

            <InputField required label="حوزه ثبتی" placeholder="پنج" name="registration_area" />

            <InputField
              isNumeric
              placeholder="31"
              label="پلاک ثبتی اصلی"
              name="main_register_number"
            />

            <InputField
              isNumeric
              placeholder="51249"
              label="پلاک ثبتی فرعی"
              name="sub_register_number"
            />

            <InputField
              isNumeric
              type="tel"
              label="شناسه قبض برق"
              placeholder="712345689123"
              name="electricity_bill_id"
              pattern={{
                value: /[0-9]/,
                message: 'شناسه قبض برق می‌بایست تنها شامل اعداد باشد',
              }}
            />

            <InputField
              isNumeric
              type="tel"
              label="کد پستی"
              placeholder="0123456789"
              name="postal_code"
            />

            <InputField
              required
              multiline
              label="آدرس"
              convertNumbers
              name="address"
              pattern={{
                value: /[^0-9]/,
                message: 'آدرس نمی‌تواند فقط شامل اعداد باشد.',
              }}
              placeholder="تهران، شهرری، میدان شهدای شاملو، خیابان فرمانداری، کوچه 14، پلاک 32، طبقه سوم، واحد 5"
            />

            <InputField
              isNumeric
              required
              type="number"
              placeholder="3"
              suffix="نفر"
              label="ظرفیت ملک"
              helperText="* ملکت رو به چند نفر اجاره میدی؟"
              name="family_members_count"
            />

            <BottomCTA>
              <Button
                className="w-full"
                type="submit"
                loading={patchPropertySpecificationsMutation.isPending}
              >
                ذخیره و ادامه
              </Button>
            </BottomCTA>
          </Form>
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default PropertySpecificationsPage
