import CollapseBox from '@/components/ui/CollapseBox'
import useContractLogic from '../../hooks/use-contract-logic'
import { prContractPartyTypeEnum } from '@/features/contract'
import { fullName } from '@/utils/dom'

function userDetails(user, showPersonalInfo) {
  return (
    <table className="border-collapse border border-slate-400 w-full text-xs">
      <tbody>
        {showPersonalInfo && (
          <tr>
            <td className="border border-slate-950 py-1.5 w-1/3">نام و نام خانوادگی</td>
            <td className="border border-slate-950 py-1.5 text-primary">{fullName(user)}</td>
          </tr>
        )}
        <tr>
          <td className="border border-slate-950 py-1.5">کد ملی</td>
          <td className="border border-slate-950 py-1.5 text-primary">{user.national_code}</td>
        </tr>
        {showPersonalInfo && (
          <>
            <tr>
              <td className="border border-slate-950 py-1.5">نام پدر</td>
              <td className="border border-slate-950 py-1.5 text-primary">{user.father_name}</td>
            </tr>
            <tr>
              <td className="border border-slate-950 py-1.5">آدرس</td>
              <td className="border border-slate-950 py-1.5 text-primary">{user.address}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  )
}

function Article1({ partiesData, statuses, showFullDetails }) {
  const landlord = partiesData?.find((p) => p.party_type === prContractPartyTypeEnum.LANDLORD)
  const tenant = partiesData?.find((p) => p.party_type === prContractPartyTypeEnum.TENANT)

  const { currentUserPartyType, signedByFirstSide, signedBySecondSide } = useContractLogic(statuses)

  const canViewFirstSidePersonalInfo =
    currentUserPartyType === prContractPartyTypeEnum.LANDLORD || signedByFirstSide

  const canViewSecondSidePersonalInfo =
    currentUserPartyType === prContractPartyTypeEnum.TENANT || signedBySecondSide

  return (
    <div className="bg-background rounded-2xl p-4 shadow-xl fa">
      <CollapseBox label="ماده 1: مشخصات طرفین" contentClassName="border-t mt-5">
        <div className="my-5">
          <div className="text-center">
            <p className="font-bold mb-3">بند اول: مشخصات موجر (طرف اول)</p>
            {landlord &&
              userDetails(landlord.user, canViewFirstSidePersonalInfo || showFullDetails)}
          </div>
          <div className="mt-10 mb-5 w-2/3 border-b mx-auto" />
          <div className="text-center">
            <p className="font-bold mb-3">بند دوم: مشخصات مستاجر (طرف دوم)</p>
            {tenant && userDetails(tenant.user, canViewSecondSidePersonalInfo || showFullDetails)}
          </div>
        </div>
      </CollapseBox>
    </div>
  )
}

export default Article1
