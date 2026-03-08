import { useState } from 'react'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import { useEditContractClauses, useDeleteContractClauses } from '../../api/contract-clauses'
import { propertyTypesOptions } from '../../libs/property-constants'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { stringSchema } from '@/utils/schema'
import { numberSeparator, numberToPersianWords } from '@/utils/number'
import { getDaysDifference } from '../../utils/date'

function SubClause({ subClause, canEdit, property, contract }) {
  const router = useRouter()
  const { contractId } = router.query

  const [isEditing, setIsEditing] = useState(false)

  const methods = useForm({
    defaultValues: { body: '' },
    values: { body: subClause.body },
    resolver: zodResolver(z.object({ body: stringSchema })),
  })

  const editItemMutation = useEditContractClauses(contractId, subClause.id)
  const deleteItemMutation = useDeleteContractClauses(contractId, subClause.id)

  const handleEdit = () => {
    setIsEditing(true)
  }
  const handleCancelEdit = () => {
    setIsEditing(false)
    methods.reset()
  }
  const handleSubmit = (data) => {
    editItemMutation.mutate(data, {
      onSuccess: () => {
        handleCancelEdit()
      },
      onError: (error) => {
        handleErrorOnSubmit(error)
      },
    })
  }
  const handleDelete = () => {
    deleteItemMutation.mutate(
      {},
      {
        onError: (error) => {
          handleErrorOnSubmit(error)
        },
      }
    )
  }

  const propertyType = propertyTypesOptions.find((i) => i.value === property?.property_type)?.label

  const chars = {
    '<tenant_count>': contract?.tenant_family_members_count || ' ',
    '<property_type>': propertyType || ' ',
    '<tenant_penalty_fee>': numberSeparator(contract?.tenant_penalty_fee || ' '),
    '<landlord_penalty_fee>': numberSeparator(contract?.landlord_penalty_fee || ' '),
    '<contract_duration>': getDaysDifference(contract?.start_date, contract?.end_date),
  }

  const regex = new RegExp(
    Object.keys(chars)
      .map((r) => `(${r})`)
      .join('|'),
    'g'
  )

  const parts = subClause.body.split(regex)

  return (
    <div className="py-4">
      <p className="text-center font-bold mb-3">
        {` بند ${numberToPersianWords(subClause.subclause_number)}:`}
        {subClause.subclause_name && ` ${subClause.subclause_name}`}
      </p>
      {isEditing ? (
        <Form
          methods={methods}
          className="bg-background rounded-2xl p-4 shadow-md py-6"
          onSubmit={(data) => handleSubmit(data)}
        >
          <InputField required multiline name="body" placeholder="متن بند" />

          <Button
            size="sm"
            variant="link"
            className="text-black"
            type="button"
            onClick={handleCancelEdit}
            disabled={editItemMutation.isPending}
          >
            انصراف
          </Button>
          <Button size="sm" variant="link" type="submit" loading={editItemMutation.isPending}>
            ذخیره
          </Button>
        </Form>
      ) : (
        <p className="font-semibold text-justify">
          {parts.filter(Boolean).map((part) =>
            chars[part] ? (
              <span key={part} className="text-teal-600 underline underline-offset-4">
                {chars[part]}
              </span>
            ) : (
              part
            )
          )}
        </p>
      )}

      {!isEditing && canEdit && (
        <>
          {subClause.is_editable && (
            <Button
              size="sm"
              variant="link"
              onClick={handleEdit}
              disabled={deleteItemMutation.isPending}
            >
              ویرایش
            </Button>
          )}
          {subClause.is_deletable && (
            <Button
              size="sm"
              variant="link"
              onClick={handleDelete}
              className="text-red-600"
              loading={deleteItemMutation.isPending}
            >
              حذف
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default SubClause
