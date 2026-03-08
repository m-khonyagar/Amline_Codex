import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import {
  CheckboxField,
  DatePickerField,
  Form,
  InputField,
  InputNumberField,
  SelectField,
  useForm,
} from '@/components/ui/Form'
import { useGetRequirementInfo } from '../api/get-requirement-info'
import { SelectCityField, useGetDistrict } from '@/features/misc'
import { useCreateRequirement, useUpdateRequirement } from '../api/create-requirement'
import { PropertyTypeOptions } from '@/data/enums/property-enums.js'
import { RequirementTypeEnums } from '@/data/enums/requirement_enums'
import { handleErrorOnSubmit } from '@/utils/error'
import { pickWithDefaults } from '@/utils/object'
import { toEnglishDigits } from '@/utils/number'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { mobileNumberSchema } from '@/utils/schema'

const roomOptions = [
  { label: 'بدون اتاق', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
]

const getFormSchema = (isRental) =>
  z.object({
    mobile: mobileNumberSchema,
    city_id: z.string({ required_error: 'شهر اجباری است' }),
    min_size: z.number({ required_error: 'حداقل متراژ اجباری است' }),
    districts: z.array(z.string()),
    property_type: z.array(z.string()),
    room_count: z.string(),
    elevator: z.boolean(),
    storage_room: z.boolean(),
    parking: z.boolean(),
    description: z.string(),
    ...(isRental
      ? {
          max_deposit: z.number({ required_error: 'حداکثر رهن اجباری است' }),
          max_rent: z.number({ required_error: 'حداکثر اجاره اجباری است' }),
        }
      : {
          sale_price: z.number({ required_error: 'برای خرید و فروش باید مبلغ را مشخص کنید' }),
          construction_year: z.string({ required_error: 'سال ساخت اجباری است' }),
        }),
    title: z.string().min(1, 'عنوان نیازمندی اجباری است.'),
    tenant_deadline: z.string(),
  })

const defaultValues = {
  mobile: '',
  city_id: undefined,
  min_size: undefined,
  districts: [],
  property_type: [],
  max_deposit: undefined,
  max_rent: undefined,
  room_count: '0',
  elevator: false,
  storage_room: false,
  parking: false,
  description: '',
  construction_year: undefined,
  sale_price: undefined,
  title: '',
  tenant_deadline: undefined,
}

const RequirementCreation = ({ requirementId, onCancel, onSuccess }) => {
  const getRequirementQuery = useGetRequirementInfo(requirementId)
  const requirement = requirementId && getRequirementQuery.data

  const [typeId, setTypeIdTab] = useState(RequirementTypeEnums.FOR_SALE)
  const isRental = typeId === RequirementTypeEnums.FOR_RENT
  const hasData = !!requirement?.id

  useEffect(() => {
    if (requirement) setTypeIdTab(requirement.type)
  }, [requirement])

  const createRequirement = useCreateRequirement()
  const updateRequirement = useUpdateRequirement(requirement?.id, { enabled: hasData })

  const formSchema = getFormSchema(isRental)
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
    values: {
      ...pickWithDefaults(requirement, defaultValues),
      city_id: requirement?.city_id?.toString(),
      districts: requirement?.districts_list?.map((i) => `${i.id}`) || [],
      property_type: requirement?.property_type?.map((i) => `${i}`) || [],
      room_count: requirement?.room_count?.toString() || '0',
      construction_year: requirement?.construction_year?.toString(),
    },
  })

  const create = (_data) => {
    createRequirement.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`نیازمندی با موفقیت ایجاد شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const update = (_data) => {
    updateRequirement.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`نیازمندی با موفقیت ویرایش شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleSubmit = (data) => {
    const _data = {
      ...data,
      type: isRental ? RequirementTypeEnums.FOR_RENT : RequirementTypeEnums.FOR_SALE,
      max_deposit: isRental ? toEnglishDigits(data.max_deposit) : undefined,
      max_rent: isRental ? toEnglishDigits(data.max_rent) : undefined,
      construction_year: isRental ? undefined : data.construction_year,
      sale_price: isRental ? undefined : toEnglishDigits(data.sale_price),
      min_size: data.min_size ? toEnglishDigits(data.min_size) : undefined,
      room_count: toEnglishDigits(data.room_count),
      mobile: data.mobile.replace(/^9/, '09'),
    }

    if (requirementId) update(_data)
    else create(_data)
  }

  const selectedCity = methods.watch('city_id')
  const districtOptionQuery = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const districtOptions = (districtOptionQuery.data || []).map((item) => {
    return {
      label: item.name,
      value: `${item.id}`,
      city_id: `${item.city_id}`,
    }
  })

  return (
    <div className="bg-white rounded-lg p-4">
      <LoadingAndRetry query={requirementId ? getRequirementQuery : {}}>
        <Tabs value={typeId} dir="rtl" onValueChange={setTypeIdTab} className="mb-6">
          <TabsList>
            <TabsTrigger
              value={RequirementTypeEnums.FOR_SALE}
              className="text-base"
              disabled={!!requirementId}
            >
              خرید
            </TabsTrigger>
            <TabsTrigger
              value={RequirementTypeEnums.FOR_RENT}
              className="text-base"
              disabled={!!requirementId}
            >
              رهن و اجاره
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-x-4">
            {!hasData && (
              <InputField
                ltr
                required
                isNumeric
                name="mobile"
                label="شماره موبایل کاربر"
                suffix={<span className="mt-0.5">+98</span>}
              />
            )}

            <InputField required label="عنوان" name="title" />

            <SelectField
              required
              asValue
              multiSelect
              options={PropertyTypeOptions}
              label={`چه ملکی برای ${isRental ? 'اجاره' : 'خرید'} نیاز داری؟`}
              name="property_type"
            />

            <SelectCityField label="شهر" required name="city_id" />

            <SelectField
              asValue
              multiSelect
              label="محله"
              name="districts"
              options={districtOptions}
            />

            <InputNumberField required min={0} label="حداقل متراژ (متر)" name="min_size" />

            {isRental ? (
              <>
                <InputNumberField min={0} label="حداکثر رهن (تومان)" name="max_deposit" />
                <InputNumberField min={0} label="حداکثر اجاره (تومان)" name="max_rent" />
              </>
            ) : (
              <>
                <DatePickerField
                  required
                  label="سال ساخت"
                  name="construction_year"
                  onlyYearPicker
                  inputFormat="yyyy"
                  format="YYYY"
                  outputFormat="YYYY"
                  portal
                />
                <InputNumberField min={0} label="قیمت کل (تومان)" name="sale_price" />
              </>
            )}

            <SelectField asValue label="تعداد اتاق" options={roomOptions} name="room_count" />

            <DatePickerField
              label="مهلت مستاجر"
              name="tenant_deadline"
              format="YYYY/MM/DD"
              inputFormat="yyyy-MM-dd"
              outputFormat="YYYY-MM-DD"
              portal
            />

            <div>
              <p className="mb-1">امکانات ساختمان</p>
              <div className="flex gap-3">
                <CheckboxField label="آسانسور" name="elevator" />
                <CheckboxField label="انباری" name="storage_room" />
                <CheckboxField label="پارکینگ" name="parking" />
              </div>
            </div>

            <InputField label="توضیحات (اختیاری)" name="description" multiline />
          </div>

          <div className="mt-4 text-left">
            {onCancel && (
              <Button
                size="sm"
                variant="gray"
                onClick={onCancel}
                disabled={createRequirement.isPending || updateRequirement.isPending}
              >
                <CloseIcon size={14} className="ml-1" /> انصراف
              </Button>
            )}

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              loading={createRequirement.isPending || updateRequirement.isPending}
            >
              {requirementId ? (
                <>
                  <DocumentEditIcon size={14} className="ml-1" />
                  ویرایش
                </>
              ) : (
                <>
                  <PlusIcon size={14} className="ml-1" />
                  ایجاد
                </>
              )}
            </Button>
          </div>
        </Form>
      </LoadingAndRetry>
    </div>
  )
}

export default RequirementCreation
