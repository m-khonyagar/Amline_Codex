import { useAuthContext } from '@/features/auth'

function LoggedInAsUserMenu() {
  const { loggedInAsUser, currentUser } = useAuthContext()

  return (
    loggedInAsUser &&
    currentUser && (
      <div className="fixed top-2 left-2 text-center p-1 rounded-md bg-red-600/10 z-50 text-sm">
        <p>ورود به عنوان</p>
        <p>{currentUser?.name}</p>
        <span>{currentUser?.mobile}</span>
      </div>
    )
  )
}

export default LoggedInAsUserMenu
