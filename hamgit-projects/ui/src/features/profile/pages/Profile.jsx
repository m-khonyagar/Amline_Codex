import { useState } from 'react'
import { HeaderNavigation } from '@/features/app'
import { useAuthContext } from '@/features/auth'
import { useGuideContext } from '@/features/guide'
import ProfileNavigationItem from '../components/ProfileNavigationItem'
import {
  InfoIcon,
  HandInIcon,
  LogoutIcon,
  SupportIcon,
  DocumentIcon,
  CreditCardIcon,
  JudgeHammerIcon,
  BookmarkIcon,
  AdsIcon,
} from '@/components/icons'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import ClientOnly from '@/components/ClientOnly'
import AppVersion from '../components/AppVersion'
import ProfileCard from '../components/ProfileCard'
// import useStorage from '@/hooks/use-storage'

export default function ProfilePage() {
  const { logoutMutation, loggedInAsUser, removeUserData, isLoggedIn, initialLoading } =
    useAuthContext()
  const [showModal, setShowModal] = useState(false)
  const { setIsSupportModalOpen } = useGuideContext()
  // const [isEitaa] = useStorage('isEitaa', false, 'sessionStorage')

  const handleLogout = () => {
    if (loggedInAsUser) {
      removeUserData()
    } else {
      logoutMutation.mutate()
    }
    setShowModal(false)
  }

  return (
    <>
      <HeaderNavigation title="حساب من" noIndex />

      <div className="p-7 flex flex-col">
        <ProfileCard className="mb-7" />

        {/* <ProfileNavigationItem label="حساب من" icon={PencilIcon} href="/profile/my-account" /> */}

        <ProfileNavigationItem label="قراردادهای من" icon={DocumentIcon} href="/contracts" />

        <ProfileNavigationItem
          label="پرداخت‌های من"
          icon={CreditCardIcon}
          href="/profile/payments"
        />

        <ProfileNavigationItem label="آگهی‌های من" icon={AdsIcon} href="/profile/my-ads" />

        <ProfileNavigationItem
          label="نیازمندی های من"
          icon={HandInIcon}
          href="profile/my-requirements"
        />

        <ProfileNavigationItem label="نشان شده ها" icon={BookmarkIcon} href="profile/bookmarks" />

        <hr className="my-3" />

        {/* eslint-disable no-undef */}
        <ProfileNavigationItem
          label="پشتیبانی"
          icon={SupportIcon}
          onClick={() => setIsSupportModalOpen(true)}
        />
        {/* eslint-enable no-undef */}

        <ProfileNavigationItem label="درباره ما" icon={InfoIcon} href="/about-us" />

        <ProfileNavigationItem label="قوانین و مقررات" icon={JudgeHammerIcon} href="/terms" />

        {!initialLoading && isLoggedIn /* && !isEitaa */ && (
          <ProfileNavigationItem
            label="خروج"
            icon={LogoutIcon}
            disabled={logoutMutation.isPending}
            onClick={() => setShowModal(true)}
          />
        )}

        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-rust-600">
              <LogoutIcon size={70} />
            </div>
            <div>آیا میخواهید از حساب کاربری خود خارج شوید؟</div>
            <div className="flex w-full gap-2 p-1 mt-4">
              <Button variant="outline" className="w-full" onClick={() => setShowModal(false)}>
                انصراف
              </Button>
              <Button className="w-full" onClick={handleLogout} loading={logoutMutation.isPending}>
                خروج
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <ClientOnly>
        <AppVersion className="mt-auto pt-8" />
      </ClientOnly>
    </>
  )
}
