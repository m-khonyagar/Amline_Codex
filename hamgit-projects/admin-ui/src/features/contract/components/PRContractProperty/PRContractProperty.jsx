import { cn } from '@/utils/dom'
import { createElement, useState } from 'react'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { CloseIcon, DocumentEditIcon, PencilIcon } from '@/components/icons'
import { useGetPRContractProperty } from '../../api/get-pr-contract-property'
import usePatchPRContractProperty from '../../api/patch-pr-contract-property'
import useCreatePRContractProperty from '../../api/create-pr-contract-property'
import {
  PRContractPropertyViewDetails,
  PRContractPropertyEditDetailsForm,
} from './PRContractPropertyDetails'
import {
  PRContractPropertyViewFeatures,
  PRContractPropertyEditFeaturesForm,
} from './PRContractPropertyFeatures'
import {
  PRContractPropertyViewSpecifications,
  PRContractPropertyEditSpecificationsForm,
} from './PRContractPropertySpecifications'

const PRContractPropertySection = ({
  title,
  contractId,
  className,
  property = {},
  editForm,
  viewComp,
  onEditChange,
}) => {
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = (s) => {
    onEditChange?.(s)
    setEditMode(s)
  }

  const createPropertyMutation = useCreatePRContractProperty(contractId)
  const patchPropertyMutation = usePatchPRContractProperty(contractId)

  const mutation = property.id ? patchPropertyMutation : createPropertyMutation

  const handleSubmit = (data, { setError }) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('اطلاعات ملک با موفقیت ویرایش شد')
        toggleEditMode(false)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }
  return (
    <div className={cn('fa bg-white rounded-lg', className)}>
      <div className="flex items-center justify-between border-b py-2 px-4">
        <h2 className="text-lg font-semibold">{editMode ? `ویرایش ${title}` : title}</h2>

        {!editMode && (
          <button
            className="text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2"
            onClick={() => toggleEditMode(true)}
          >
            <PencilIcon size={16} />
            ویرایش
          </button>
        )}
      </div>

      {editMode
        ? createElement(
            editForm,
            { property, onSubmit: handleSubmit },
            <div className="text-left">
              <Button
                size="sm"
                variant="gray"
                onClick={() => toggleEditMode(false)}
                disabled={mutation.isPending}
              >
                <CloseIcon size={14} className="ml-1" /> انصراف
              </Button>
              <Button size="sm" type="submit" className="mr-2" loading={mutation.isPending}>
                <DocumentEditIcon size={14} className="ml-1" /> ثبت
              </Button>
            </div>
          )
        : createElement(viewComp, { property })}
    </div>
  )
}

const PRContractProperty = ({ contractId }) => {
  const [editSection, setEditSection] = useState(null)
  const prContractPropertyQuery = useGetPRContractProperty(contractId)

  const property = prContractPropertyQuery.data

  return (
    <div>
      <LoadingAndRetry query={prContractPropertyQuery} checkRefetching>
        {!property && <div className="mb-4 text-orange-600">اطلاعات ملک ثبت نشده است</div>}

        <div className="flex flex-wrap gap-4">
          {(editSection === null || editSection === 'specifications') && (
            <PRContractPropertySection
              title="مشخصات"
              className="flex-grow basis-full lg:basis-1/4 lg:max-w-xl mx-auto"
              property={property}
              contractId={contractId}
              viewComp={PRContractPropertyViewSpecifications}
              editForm={PRContractPropertyEditSpecificationsForm}
              onEditChange={(s) => setEditSection(s ? 'specifications' : null)}
            />
          )}

          {(editSection === null || editSection === 'details') && (
            <PRContractPropertySection
              title="جزئیات"
              className="flex-grow basis-full lg:basis-1/4 lg:max-w-xl mx-auto"
              property={property}
              contractId={contractId}
              viewComp={PRContractPropertyViewDetails}
              editForm={PRContractPropertyEditDetailsForm}
              onEditChange={(s) => setEditSection(s ? 'details' : null)}
            />
          )}

          {(editSection === null || editSection === 'features') && (
            <PRContractPropertySection
              title="امکانات"
              className="flex-grow basis-full lg:basis-1/4 lg:max-w-xl mx-auto"
              property={property}
              contractId={contractId}
              viewComp={PRContractPropertyViewFeatures}
              editForm={PRContractPropertyEditFeaturesForm}
              onEditChange={(s) => setEditSection(s ? 'features' : null)}
            />
          )}
        </div>
      </LoadingAndRetry>
    </div>
  )
}

export default PRContractProperty
