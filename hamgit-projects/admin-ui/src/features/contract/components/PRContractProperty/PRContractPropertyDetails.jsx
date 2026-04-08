import { format } from 'date-fns-jalali'
import { translateEnum } from '@/utils/enum'
import {
  PropertyDirectionTypeOptions,
  PropertyFacadeTypeOptions,
  PropertyFlooringTypeOptions,
  PropertyStructureTypeOptions,
} from '@/data/enums/property-enums'
import { DatePickerField, Form, InputNumberField, SelectField, useForm } from '@/components/ui/Form'
import { convertEmptyStringsToNull, pickWithDefaults } from '@/utils/object'
import { ChevronDownIcon } from '@/components/icons'

const PRContractPropertyViewDetails = ({ property = {} }) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">مساحت:</div>
        <div className="mr-auto">
          {property.area ? (
            <>
              {property.area} <span className="text-sm">متر مربع</span>
            </>
          ) : (
            '-'
          )}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سال ساخت:</div>
        <div className="mr-auto">
          {property.build_year ? format(`${property.build_year}-06-01`, 'yyyy') : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">نوع اسکلت:</div>
        <div className="mr-auto">
          {property.structure_type
            ? translateEnum(PropertyStructureTypeOptions, property.structure_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">نمای ساختمان:</div>
        <div className="mr-auto flex flex-wrap gap-2 my-1 justify-end">
          {property.facade_types?.length > 0
            ? property.facade_types.map((f) => (
                <span key={f} className="border rounded-md px-2 text-sm text-gray-600">
                  {translateEnum(PropertyFacadeTypeOptions, f)}
                </span>
              ))
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">سمت واحد:</div>
        <div className="mr-auto">
          {property.direction_type
            ? translateEnum(PropertyDirectionTypeOptions, property.direction_type)
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-sm text-gray-700 mt-1">نوع کفپوش:</div>
        <div className="mr-auto flex flex-wrap gap-2 my-1 justify-end">
          {property.flooring_types?.length > 0
            ? property.flooring_types.map((f) => (
                <span key={f} className="border rounded-md px-2 text-sm text-gray-600">
                  {translateEnum(PropertyFlooringTypeOptions, f)}
                </span>
              ))
            : '-'}
        </div>
      </div>
    </div>
  )
}

const PRContractPropertyEditDetailsForm = ({ property = {}, onSubmit, children }) => {
  const methods = useForm({
    defaultValues: {
      ...pickWithDefaults(property, {
        area: '',
        build_year: '',
        structure_type: null,
        facade_types: [],
        direction_type: null,
        flooring_types: [],
      }),
      build_year: property?.build_year ? `${property.build_year.toString()}-06-01` : null,
    },
  })

  const handleSubmit = (data, methods) => {
    onSubmit(
      convertEmptyStringsToNull({
        ...data,
      }),
      methods
    )
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <InputNumberField
        label="مساحت"
        decimalScale={2}
        suffix="متر مربع"
        placeholder="مساحت"
        decimalSeparator="/"
        name="area"
      />

      <DatePickerField
        format="YYYY"
        label="سال ساخت"
        inputFormat="yyyy-MM-dd"
        outputFormat="YYYY"
        dayPicker={false}
        monthPicker={false}
        placeholder="انتخاب کنید"
        suffixIcon={<ChevronDownIcon />}
        name="build_year"
      />

      <SelectField
        asValue
        label="نوع اسکلت"
        name="structure_type"
        options={PropertyStructureTypeOptions}
      />

      <SelectField
        asValue
        multiSelect
        label="نمای ساختمان"
        name="facade_types"
        options={PropertyFacadeTypeOptions}
      />

      <SelectField
        asValue
        label="سمت واحد"
        name="direction_type"
        options={PropertyDirectionTypeOptions}
      />

      <SelectField
        asValue
        multiSelect
        label="نوع کفپوش"
        name="flooring_types"
        options={PropertyFlooringTypeOptions}
      />

      {children}
    </Form>
  )
}

export { PRContractPropertyViewDetails, PRContractPropertyEditDetailsForm }
