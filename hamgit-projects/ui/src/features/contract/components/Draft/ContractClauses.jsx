import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import _ from 'lodash'
import CollapseBox from '@/components/ui/CollapseBox'
import { CirclePlusIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import SubClause from './SubClause'
import Button from '@/components/ui/Button'
import { useGetContractClauses, useCreateContractClauses } from '../../api/contract-clauses'
import { handleErrorOnSubmit } from '@/utils/error'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { stringSchema } from '@/utils/schema'

function ContractClauses({ canAddClause, property, contract }) {
  const router = useRouter()
  const { contractId } = router.query
  const clausesQuery = useGetContractClauses(contractId, { enabled: router.isReady })

  const [showForm, setShowForm] = useState(false)

  const createContractClausesMutate = useCreateContractClauses(contractId)

  const [collapseKey, setCollapseKey] = useState(0)

  const scrollTargetRef = useRef(null)

  const methods = useForm({
    defaultValues: { body: '' },
    resolver: zodResolver(z.object({ body: stringSchema })),
  })

  const handleCloseForm = () => {
    setShowForm(false)
    methods.reset()
  }

  const handleSubmit = (data) => {
    createContractClausesMutate.mutate(data, {
      onSuccess: (res) => {
        handleCloseForm()
        setCollapseKey(res.data?.clause_number?.toString())
        setTimeout(() => {
          scrollTargetRef.current.scrollIntoView()
        }, 500)
      },
      onError: (error) => {
        handleErrorOnSubmit(error)
      },
    })
  }

  const clauses = useMemo(() => _.groupBy(clausesQuery.data, 'clause_number'), [clausesQuery.data])

  return (
    <div className="flex flex-col gap-6">
      <LoadingAndRetry query={clausesQuery} skeletonItemCount={1}>
        {_.map(clauses, (val, key) => (
          <div key={key} className="bg-background rounded-2xl p-4 shadow-xl fa">
            <CollapseBox
              open={collapseKey === key}
              onToggle={(isOpen) => setCollapseKey(isOpen ? key : '0')}
              label={` ماده ${key}: ${val[0].clause_name}`}
            >
              <div className="divide-y">
                {val.map((subClause) => (
                  <SubClause
                    subClause={subClause}
                    key={subClause.id}
                    canEdit={canAddClause}
                    property={property}
                    contract={contract}
                  />
                ))}
              </div>
            </CollapseBox>
          </div>
        ))}
      </LoadingAndRetry>

      <div ref={scrollTargetRef} />

      {canAddClause && !showForm && (
        <button
          type="button"
          className="bg-background rounded-2xl p-4 shadow-md py-6 flex items-center justify-center text-primary gap-2"
          onClick={() => setShowForm(true)}
        >
          <CirclePlusIcon />
          <p>اضافه کردن بند به تعهدات</p>
        </button>
      )}

      {canAddClause && showForm && (
        <Form
          methods={methods}
          className="bg-background rounded-2xl p-4 shadow-md py-6"
          onSubmit={(data) => handleSubmit(data)}
        >
          <InputField required multiline name="body" label="متن بند جدید" placeholder="متن بند" />
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Button variant="outline" onClick={handleCloseForm}>
              انصراف
            </Button>
            <Button type="submit" loading={createContractClausesMutate.isPending}>
              اضافه کردن
            </Button>
          </div>
        </Form>
      )}
    </div>
  )
}

export default ContractClauses
