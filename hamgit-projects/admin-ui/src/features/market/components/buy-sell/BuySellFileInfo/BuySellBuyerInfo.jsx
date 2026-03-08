import { userGenderTranslation } from '@/data/enums/user-enums'

export const BuySellBuyerInfo = ({ buyerInfo }) => (
  <div className="grid lg:grid-cols-2 gap-y-24">
    <div className="space-y-4 px-6 lg:border-l border-black/20">
      <p className="flex items-center justify-between gap-8">
        <span>شماره موبایل خریدار: </span>
        <span className="fa text-left">{buyerInfo?.mobile || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>نام و نام خانوادگی: </span>
        <span className="text-left">{buyerInfo?.full_name || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>جنسیت: </span>
        <span className="text-left">{userGenderTranslation[buyerInfo?.gender] || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>تعداد خانواده: </span>
        <span className="text-left fa">{buyerInfo?.family_members_count || '--'}</span>
      </p>
    </div>

    <div className="space-y-4 px-6">
      <p className="text-xl font-medium">همکاری با املاین</p>

      <div className="flex items-center justify-between gap-8">
        <span>لینک اگهی ایتا: </span>
        {buyerInfo?.eitaa_ad_link ? (
          <a
            className="text-left text-[#0566C8] underline"
            href={buyerInfo.eitaa_ad_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {buyerInfo.eitaa_ad_link}
          </a>
        ) : (
          <span>--</span>
        )}
      </div>
    </div>
  </div>
)
