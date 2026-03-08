import Image from 'next/image'
import profileImg from '@/assets/images/profile.svg'
import { Skeleton } from '@/components/ui/Skeleton'

function MessagesHeader({ user, isLoading }) {
  return (
    <div className="flex items-center gap-4 px-6 border-b py-4">
      {isLoading && (
        <>
          <Skeleton className="rounded-full h-[48px] w-[48px]" />

          <div className="flex-grow">
            <Skeleton className="rounded w-2/12 h-4" />
            <Skeleton className="rounded w-3/12 h-4 mt-2" />
          </div>
        </>
      )}

      {!isLoading && user && (
        <>
          <Image src={profileImg.src} alt="user" width={48} height={48} />
          <div>{user?.name || 'کاربر املاین'}</div>
        </>
      )}
    </div>
  )
}

export default MessagesHeader
