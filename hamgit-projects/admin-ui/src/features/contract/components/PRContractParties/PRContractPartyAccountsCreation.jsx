import { z } from 'zod'
import { Fragment } from 'react'
import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { zodResolver } from '@hookform/resolvers/zod'
import { ibanSchema, stringSchema } from '@/utils/schema'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { bankAccountType, partyType, partyTypeOptions } from '@/data/enums/prcontract-enums'
import useUpsertPRContractPartyAccount from '../../api/upsert-pr-contract-party-account'

const accountsPartyTypeConfig = {
  [partyType.LANDLORD]: [
    {
      prefix: 'landlord_deposit',
      title: 'رهن',
      accountType: bankAccountType.DEPOSIT,
    },
    {
      prefix: 'landlord_rent',
      title: 'اجاره',
      accountType: bankAccountType.RENT,
    },
  ],
  [partyType.TENANT]: [
    {
      prefix: 'tenant',
      title: null,
      accountType: null,
    },
  ],
}

const PRContractPartyAccountsCreation = ({ contractId, party, partyType, onCancel, onSuccess }) => {
  const accountsConfig = accountsPartyTypeConfig[partyType]

  const upsertPRContractPartyAccountMutation = useUpsertPRContractPartyAccount(contractId, party.id)

  const methods = useForm({
    defaultValues: async () => {
      return accountsConfig.reduce((pr, crr) => {
        const account = (party.bank_accounts || []).find((a) =>
          crr.accountType ? a.type == crr.accountType : !a.type
        )
        pr[`${crr.prefix}_iban`] = account?.iban || ''
        pr[`${crr.prefix}_iban_owner_name`] = account?.owner_name || ''
        return pr
      }, {})
    },
    resolver: zodResolver(
      z.object(
        accountsConfig.reduce((pr, crr) => {
          pr[`${crr.prefix}_iban`] = ibanSchema
          pr[`${crr.prefix}_iban_owner_name`] = stringSchema
          return pr
        }, {})
      )
    ),
  })

  const handleSubmit = (data, { setError }) => {
    upsertPRContractPartyAccountMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(`حساب‌های ${translateEnum(partyTypeOptions, partyType)} با موفقیت ویرایش شد.`)

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      {accountsConfig.map((ac, i) => (
        <Fragment key={i}>
          <InputField
            ltr
            required
            isNumeric
            type="tel"
            suffix="IR"
            name={`${ac.prefix}_iban`}
            label={ac.title ? `شماره شبا برای ${ac.title}` : 'شماره شبا'}
            placeholder="123456000000004518264578"
            // helperText="دوست داری مستاجر مبلغ رهن رو به کدوم کارتت بزنه؟"
          />

          <InputField
            required
            label="به نام"
            placeholder="علی رفیعی"
            name={`${ac.prefix}_iban_owner_name`}
          />
        </Fragment>
      ))}

      <div className="text-left mt-4">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={upsertPRContractPartyAccountMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          type="submit"
          className="mr-2"
          loading={upsertPRContractPartyAccountMutation.isPending}
        >
          <DocumentEditIcon size={14} className="ml-1" /> ثبت
        </Button>
      </div>
    </Form>
  )
}

export default PRContractPartyAccountsCreation
