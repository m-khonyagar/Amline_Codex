import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Button from '@/components/ui/Button'
import { DatePickerField, Form, InputNumberField, SelectField, useForm } from '@/components/ui/Form'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { ChevronDownIcon } from '@/components/icons'
import { useContractLogic } from '@/features/contract'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { handleErrorOnSubmit } from '@/utils/error'
import { pickWithDefaults } from '@/utils/object'
import useBack from '@/hooks/use-back'
import { getPropertyInformationSteps } from '../../libs/property-steps'
import {
  propertyDirectionTypeOptions,
  propertyFacadeTypeOptions,
  propertyFlooringTypeOptions,
  propertyStructureTypeOptions,
} from '../../libs/property-constants'
import useGetContractStatus from '../../api/get-contract-status'
import useGetPrContractProperty from '../../api/get-pr-contract-property'
import usePatchPrContractsPropertyDetails from '../../api/patch-pr-contracts-property-details'

const defaultValues = {
  area: '',
  build_year: '',
  structure_type: null,
  facade_types: [],
  direction_type: null,
  flooring_types: [],
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

function PropertyDetailsPage() {
  const router = useRouter()
  const { goBack } = useBack()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const contractPropertyQuery = useGetPrContractProperty(contractId, { enabled: router.isReady })
  const { data: contractProperty } = contractPropertyQuery

  const patchPropertyDetailsMutation = usePatchPrContractsPropertyDetails(contractId)
  const { signedByCurrentUser } = useContractLogic(statuses)

  const methods = useForm({
    defaultValues,
    values: {
      ...pickWithDefaults(contractProperty || {}, defaultValues),
      build_year: contractProperty?.build_year
        ? `${contractProperty?.build_year?.toString()}-06-01`
        : null,
    },
  })

  const backUrl = useMemo(() => calcBack(statuses, contractId).url, [contractId, statuses])
  const handleBack = (data) => {
    const { url, count } = calcBack(data || statuses, contractId)
    goBack(url, count)
  }

  const onSubmitDetails = (data) => {
    const formattedData = {
      ...data,
      build_year: data?.build_year ? new Date(data?.build_year).getFullYear() : null,
    }

    patchPropertyDetailsMutation.mutate(formattedData, {
      onSuccess: () => {
        contractStatusQuery.refetch().then((res) => {
          handleBack(res.data)
        })
      },
      onError: (err) => {
        handleErrorOnSubmit(err, methods.setError, data)
      },
    })
  }

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <div>
      <HeaderNavigation title="جزئیات ملک" backUrl={backUrl} />

      <div className="px-8 py-6">
        <LoadingAndRetry ignore404 query={[contractStatusQuery, contractPropertyQuery]}>
          {contractStatusQuery.data && (
            <Form className="flex flex-col gap-2" methods={methods} onSubmit={onSubmitDetails}>
              <InputNumberField
                required
                label="مساحت"
                decimalScale={2}
                suffix="متر مربع"
                placeholder="مساحت"
                decimalSeparator="/"
                name="area"
              />

              <DatePickerField
                required
                format="yyyy"
                label="سال ساخت"
                valueFormat="yyyy-MM-dd"
                dayPicker={false}
                monthPicker={false}
                placeholder="انتخاب کنید"
                suffixIcon={<ChevronDownIcon />}
                name="build_year"
              />

              <SelectField
                required
                asValue
                label="نوع اسکلت"
                name="structure_type"
                options={propertyStructureTypeOptions}
              />

              <SelectField
                required
                asValue
                multiSelect
                label="نمای ساختمان"
                name="facade_types"
                options={propertyFacadeTypeOptions}
              />

              <SelectField
                required
                asValue
                label="سمت واحد"
                name="direction_type"
                options={propertyDirectionTypeOptions}
              />

              <SelectField
                required
                asValue
                multiSelect
                label="نوع کفپوش"
                name="flooring_types"
                options={propertyFlooringTypeOptions}
              />

              <BottomCTA>
                <Button
                  className="w-full"
                  type="submit"
                  loading={patchPropertyDetailsMutation.isPending}
                >
                  ذخیره و ادامه
                </Button>
              </BottomCTA>
            </Form>
          )}
        </LoadingAndRetry>
      </div>
    </div>
  )
}
export default PropertyDetailsPage
