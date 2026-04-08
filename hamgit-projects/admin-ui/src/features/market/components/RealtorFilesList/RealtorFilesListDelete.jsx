import Button from '@/components/ui/Button'

export const RealtorFilesListDelete = ({ file, onCancel, onSuccess }) => {
  const handleDelete = () => {
    // TODO: Implement actual delete API call
    onSuccess()
  }

  return (
    <div className="space-y-4">
      <p>آیا از حذف فایل مشاور املاک &quot;{file?.full_name}&quot; اطمینان دارید؟</p>

      <div className="flex gap-2 justify-end">
        <Button variant="gray" onClick={onCancel}>
          انصراف
        </Button>
        <Button variant="error" onClick={handleDelete}>
          حذف
        </Button>
      </div>
    </div>
  )
}
