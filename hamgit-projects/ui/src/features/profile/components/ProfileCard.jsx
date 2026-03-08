import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/features/auth'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronLeftIcon, LoginIcon, UserIcon } from '@/components/icons'
import { cn } from '@/utils/dom'

function ProfileCard({ className }) {
  const { currentUser, isLoadingCurrentUser, isLoggedIn, initialLoading } = useAuthContext()
  const { asPath } = useRouter()

  return (
    <Link
      href={isLoggedIn ? '/profile/my-account' : `/auth?prev=${encodeURIComponent(asPath)}`}
      className={cn(
        'h-[90px] border border-teal-600 rounded-2xl px-5 flex items-center group',
        className
      )}
    >
      {(initialLoading || isLoadingCurrentUser) && (
        <>
          <Skeleton className="rounded-full size-[66px] shrink-0" />
          <div className="mr-4 flex flex-col w-full gap-1">
            <Skeleton className="rounded-full w-2/3 h-[18px]" />
            <Skeleton className="rounded-full w-1/2 h-[18px]" />
          </div>
        </>
      )}

      {!initialLoading && !isLoadingCurrentUser && isLoggedIn && (
        <>
          <div
            className={cn(
              'rounded-full size-[66px] shrink-0 flex items-center justify-center bg-white overflow-hidden',
              { 'border-2 border-gray-600 text-gray-600': !currentUser?.avatar_file?.url }
            )}
          >
            {!currentUser?.avatar_file?.url ? (
              <UserIcon size={38} />
            ) : (
              <Image
                width={66}
                height={66}
                alt="user"
                src={currentUser.avatar_file.url}
                className="object-cover size-full"
              />
            )}
          </div>

          <div className="mr-5">
            <p className="font-medium text-gray-600 fa">
              {currentUser?.name || currentUser?.mobile}
            </p>
            {currentUser.is_verified ? (
              <div className="text-sm text-green-600">احراز هویت شده</div>
            ) : (
              <div className="text-sm text-yellow-600">احراز هویت نشده</div>
            )}
          </div>
        </>
      )}

      {!initialLoading && !isLoadingCurrentUser && !isLoggedIn && (
        <div>
          <div className="flex items-center gap-3">
            <LoginIcon />
            <p className="font-medium text-black">ورود به حساب کاربری</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            برای دسترسی به تمام امکانات املاین وارد شوید.
          </p>
        </div>
      )}

      <ChevronLeftIcon
        className="mr-auto shrink-0 transition-all text-gray-300 group-hover:text-teal-900"
        size={24}
      />
    </Link>
  )
}

export default ProfileCard
