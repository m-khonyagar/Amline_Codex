import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import {
  CheckboxField,
  Form,
  InputField,
  InputNumberField,
  SelectField,
  useForm,
} from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useBack from '@/hooks/use-back'
import { getPropertyInformationSteps } from '../../libs/property-steps'
import { useContractLogic } from '@/features/contract'
import {
  propertyCoolingSystemTypeOptions,
  propertyFacilitiesType,
  propertyHeatingSystemTypeOptions,
  propertyKitchenTypeOptions,
  propertyRestroomTypeOptions,
  propertySupplyTypeOptions,
} from '../../libs/property-constants'
import useGetContractStatus from '../../api/get-contract-status'
import useGetPrContractProperty from '../../api/get-pr-contract-property'
import usePatchPrContractsPropertyFacilities from '../../api/patch-pr-contracts-property-facilities'
import { pickWithDefaults } from '@/utils/object'
import { PlusIcon, MinusIcon } from '@/components/icons'

const defaultValues = {
  restroom_type: '',
  heating_system_types: [],
  cooling_system_types: [],
  kitchen_type: '',
  water_supply_type: '',
  electricity_supply_type: '',
  gas_supply_type: '',
  sewage_supply_type: '',
  number_of_rooms: '',
  parking: false,
  parking_number: '',
  landline: false,
  landline_number: [],
  elevator: false,
  storage_room: false,
  storage_room_number: '',
  storage_room_area: '',
  other_facilities: [],
  description: '',
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

function PropertyFeaturesPage() {
  const router = useRouter()
  const { contractId } = router.query
  const [landline, setLandline] = useState({
    value: '',
    error: null,
  })

  const { goBack } = useBack()

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const contractPropertyQuery = useGetPrContractProperty(contractId, { enabled: router.isReady })

  const { data: statuses } = contractStatusQuery
  const { data: contractProperty } = contractPropertyQuery

  const patchPropertyFacilitiesMutation = usePatchPrContractsPropertyFacilities(contractId)
  const { signedByCurrentUser } = useContractLogic(statuses)

  const methods = useForm({
    defaultValues,
    values: pickWithDefaults(contractProperty, defaultValues),
  })

  const storageRoom = methods.watch('storage_room')
  const numbers = methods.watch('landline_number')

  const addNumber = (value) => {
    const current = methods.getValues('landline_number')
    methods.setValue('landline_number', [...current, value])
  }

  const removeNumber = (index) => {
    const current = methods.getValues('landline_number')
    const updated = current.filter((_, i) => i !== index)
    methods.setValue('landline_number', updated)
  }

  const backUrl = useMemo(() => calcBack(statuses, contractId).url, [contractId, statuses])
  const handleBack = (data) => {
    const { url, count } = calcBack(data || statuses, contractId)
    goBack(url, count)
  }

  const onSubmitFeatures = (data) => {
    if (data.landline && data.landline_number.length === 0) {
      setLandline((prev) => ({ ...prev, error: 'این گزینه اجباری است.' }))
      return
    }

    const _data = {
      ...data,
      storage_room_number: data.storage_room ? Number(data.storage_room_number) : undefined,
      storage_room_area: data.storage_room ? Number(data.storage_room_area) : undefined,
      parking_number: data.parking ? Number(data.parking_number) : undefined,
      landline_number: data.landline ? data.landline_number : [],
      number_of_rooms: data.number_of_rooms ? Number(data.number_of_rooms) : null,
    }

    patchPropertyFacilitiesMutation.mutate(_data, {
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
    if (signedByCurrentUser) router.replace(`/contracts/${contractId}`)
  }, [contractId, signedByCurrentUser, router])

  return (
    <div>
      <HeaderNavigation title="امکانات ملک" backUrl={backUrl} />

      <div className="px-8 py-6">
        <LoadingAndRetry ignore404 query={[contractStatusQuery, contractPropertyQuery]}>
          {contractStatusQuery.data && (
            <Form className="flex flex-col gap-2" methods={methods} onSubmit={onSubmitFeatures}>
              <SelectField
                asValue
                required
                label="سرویس بهداشتی"
                name="restroom_type"
                options={propertyRestroomTypeOptions}
              />

              <SelectField
                asValue
                required
                multiSelect
                label="سیستم گرمایشی"
                name="heating_system_types"
                options={propertyHeatingSystemTypeOptions}
              />

              <SelectField
                asValue
                multiSelect
                required
                label="سرویس سرمایشی"
                name="cooling_system_types"
                options={propertyCoolingSystemTypeOptions}
              />

              <SelectField
                asValue
                required
                label="آشپزخانه"
                name="kitchen_type"
                options={propertyKitchenTypeOptions}
              />

              <SelectField
                required
                asValue
                label="آب"
                name="water_supply_type"
                options={propertySupplyTypeOptions}
              />

              <SelectField
                required
                asValue
                label="برق"
                name="electricity_supply_type"
                options={propertySupplyTypeOptions}
              />

              <SelectField
                required
                asValue
                label="گاز"
                name="gas_supply_type"
                options={propertySupplyTypeOptions}
              />

              <SelectField
                required
                asValue
                label="فاضلاب"
                name="sewage_supply_type"
                options={propertySupplyTypeOptions}
              />

              <InputField
                type="tel"
                isNumeric
                placeholder="3"
                label="تعداد اتاق"
                name="number_of_rooms"
              />

              <div className="flex flex-col gap-4 mb-4">
                <div>
                  <CheckboxField label="پارکینگ" name="parking" />

                  {methods.watch('parking') && (
                    <InputField
                      required
                      isNumeric
                      className="mt-2"
                      placeholder="شماره پارکینگ"
                      name="parking_number"
                    />
                  )}
                </div>

                <div>
                  <CheckboxField label="انباری" name="storage_room" />

                  {storageRoom && (
                    <div className="flex flex-col gap-1 mt-2">
                      <InputNumberField
                        required
                        decimalScale={2}
                        suffix="متر مربع"
                        placeholder="متراژ انباری"
                        decimalSeparator="/"
                        name="storage_room_area"
                      />

                      <InputField
                        required
                        isNumeric
                        placeholder="شماره انباری"
                        name="storage_room_number"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <CheckboxField label="تلفن" name="landline" />

                  {methods.watch('landline') && (
                    <>
                      <div className="flex items-start gap-3.5 mt-2">
                        <Input
                          ltr
                          isNumeric
                          type="tel"
                          className="flex-grow"
                          placeholder="شماره تلفن"
                          value={landline.value}
                          error={landline.error}
                          onChange={({ target: { value } }) =>
                            setLandline(() => ({
                              value,
                              error: null,
                            }))
                          }
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          className="size-[48px] flex shrink-0 border-2"
                          onClick={() => {
                            if (!landline.value) {
                              setLandline((prev) => ({
                                ...prev,
                                error: 'شماره تلفن نمی‌تواند خالی باشد',
                              }))
                              return
                            }

                            if (methods.watch('landline_number').includes(landline.value)) {
                              setLandline((prev) => ({
                                ...prev,
                                error: 'شماره تلفن تکراری است',
                              }))
                              return
                            }

                            setLandline({ value: '', error: null })
                            addNumber(landline.value)
                          }}
                        >
                          <PlusIcon />
                        </Button>
                      </div>

                      <div className="flex flex-col">
                        {numbers.map((number, index) => (
                          <div key={number} className="flex items-start gap-3.5">
                            <Input
                              readOnly
                              isNumeric
                              type="tel"
                              value={number}
                              className="flex-grow"
                            />

                            <Button
                              variant="outline"
                              size="icon"
                              className="size-[48px] flex shrink-0 border-2 border-red-600"
                              onClick={() => removeNumber(index)}
                            >
                              <MinusIcon size={30} className="text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <CheckboxField label="آسانسور" name="elevator" />
              </div>

              <SelectField
                asValue
                multiSelect
                label="سایر امکانات"
                name="other_facilities"
                options={propertyFacilitiesType}
              />

              <InputField
                multiline
                label="توضیحات (اختیاری)"
                name="description"
                placeholder="تمامی وسایل روشنایی خونه لوکس و اصل فرانسه‌ و عمرشون با ضمانت 100 ساله‌س "
              />

              <BottomCTA>
                <Button
                  className="w-full"
                  type="submit"
                  loading={patchPropertyFacilitiesMutation.isPending}
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

export default PropertyFeaturesPage
