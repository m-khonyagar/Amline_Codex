import Button from '@/components/ui/Button'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthContext } from '@/features/auth'
import { cn } from '@/utils/dom'
import useUpdateProfile from '../api/update-profile'
import { handleErrorOnSubmit } from '@/utils/error'

function ChatProfile({ className }) {
  const { currentUser, isLoadingCurrentUser } = useAuthContext()
  const updateProfileMutation = useUpdateProfile()

  const methods = useForm({
    defaultValues: { name: currentUser?.name || '' },
    values: { name: currentUser?.name || '' },
  })

  const handleSubmit = (data) => {
    updateProfileMutation.mutate(
      { userId: currentUser.id, name: data.name },
      {
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }

  return (
    <div className={cn('px-6 py-6', className)}>
      {isLoadingCurrentUser && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!isLoadingCurrentUser && (
        <Form methods={methods} onSubmit={handleSubmit}>
          <InputField required name="name" label="نام نمایشی شما در گفتگو" />

          <Button type="submit" className="w-full mt-4" loading={updateProfileMutation.isPending}>
            ذخیره
          </Button>
        </Form>
      )}
    </div>
  )
}

export default ChatProfile
