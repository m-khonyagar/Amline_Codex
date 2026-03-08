import { userGenderTranslation } from '@/data/enums/user-enums'
import { MonopolyLabels } from '@/data/enums/market_enums'

export const BuySellSellerInfo = ({ sellerInfo }) => (
  <div className="grid lg:grid-cols-2 gap-y-24">
    <div className="space-y-4 px-6 lg:border-l border-black/20">
      <p className="flex items-center justify-between gap-8">
        <span>شماره موبایل فروشنده: </span>
        <span className="fa text-left">{sellerInfo?.mobile || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>نام و نام خانوادگی: </span>
        <span className="text-left">{sellerInfo?.full_name || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>جنسیت: </span>
        <span className="text-left">{userGenderTranslation[sellerInfo?.gender] || '--'}</span>
      </p>
    </div>

    <div className="space-y-4 px-6">
      <p className="text-xl font-medium">همکاری با املاین</p>

      <p className="flex items-center justify-between gap-8">
        <span>فروشنده حاضر به حذف آگهی دیوار بود؟: </span>
        <span className="text-left">{MonopolyLabels[sellerInfo?.monopoly] || '--'}</span>
      </p>

      <p className="flex items-center justify-between gap-8">
        <span>دلیل عدم حذف آگهی توسط فروشنده: </span>
        <span className="text-left">{sellerInfo?.reason_for_not_removing_ad || '--'}</span>
      </p>

      <div className="flex items-center justify-between gap-8">
        <span>لینک اگهی دیوار: </span>
        {sellerInfo?.divar_ad_link ? (
          <a
            className="text-left text-[#0566C8] underline"
            href={sellerInfo.divar_ad_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {sellerInfo.divar_ad_link}
          </a>
        ) : (
          <span>--</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-8">
        <span>لینک اگهی ایتا: </span>
        {sellerInfo?.eitaa_ad_link ? (
          <a
            className="text-left text-[#0566C8] underline"
            href={sellerInfo.eitaa_ad_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {sellerInfo.eitaa_ad_link}
          </a>
        ) : (
          <span>--</span>
        )}
      </div>
    </div>
  </div>
)
