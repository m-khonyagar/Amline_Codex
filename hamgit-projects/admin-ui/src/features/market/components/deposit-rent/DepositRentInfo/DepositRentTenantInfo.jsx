import { userGenderTranslation } from '@/data/enums/user-enums'

export const DepositRentTenantInfo = ({ tenantInfo }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-y-24">
      <div className="space-y-4 px-6 lg:border-l border-black/20">
        <p className="flex items-center justify-between gap-8">
          <span>شماره موبایل مستأجر: </span>
          <span className="fa text-left">{tenantInfo?.mobile || '--'}</span>
        </p>

        <p className="flex items-center justify-between gap-8">
          <span>نام و نام خانوادگی: </span>
          <span className="text-left">{tenantInfo?.full_name || '--'}</span>
        </p>

        <p className="flex items-center justify-between gap-8">
          <span>جنسیت: </span>
          <span className="text-left">{userGenderTranslation[tenantInfo?.gender] || '--'}</span>
        </p>

        <p className="flex items-center justify-between gap-8">
          <span>تعداد خانواده: </span>
          <span className="text-left fa">{tenantInfo?.family_members_count || '--'}</span>
        </p>
      </div>

      <div className="space-y-4 px-6">
        <p className="text-xl font-medium">همکاری با املاین</p>

        <div className="flex items-center justify-between gap-8">
          <span>لینک اگهی ایتا: </span>
          {tenantInfo?.eitaa_ad_link ? (
            <a
              className="text-left text-[#0566C8] underline"
              href={tenantInfo.eitaa_ad_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tenantInfo.eitaa_ad_link}
            </a>
          ) : (
            <span>--</span>
          )}
        </div>
      </div>
    </div>
  )
}
