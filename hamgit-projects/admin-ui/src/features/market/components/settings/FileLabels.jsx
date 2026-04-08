import { useState } from 'react'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  useGetFileLabels,
  useCreateFileLabel,
  useUpdateFileLabel,
  useDeleteFileLabel,
} from '../../api/file-labels'
import { PencilIcon } from '@/components/icons'

export const FileLabels = ({ type = 'FILE' }) => {
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const getFileLabelsQuery = useGetFileLabels(type)
  const { data: labels = [], refetch } = getFileLabelsQuery

  const createMutation = useCreateFileLabel({
    onSuccess: () => {
      setTitle('')
      refetch()
    },
  })

  const updateMutation = useUpdateFileLabel({
    onSuccess: refetch,
  })

  const deleteMutation = useDeleteFileLabel({
    onSuccess: refetch,
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({ title, type })
  }

  const handleEditClick = (id, currentTitle) => {
    setEditingId(id)
    setEditingTitle(currentTitle)
  }

  const handleEditSave = (id) => {
    if (!editingTitle.trim()) return
    updateMutation.mutate(
      { id, title: editingTitle, type },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditingTitle('')
        },
      }
    )
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const handleDelete = (id) => {
    if (window.confirm('مطمعن هستی که میخوای این برچسب را حذف کنی؟')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg px-6 py-10 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        مدیریت برچسب های {type === 'FILE' ? 'فایل' : 'کاربر'}
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 lg:w-1/2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان برچسب فایل جدید"
          className="flex-1"
        />
        <Button type="submit" loading={createMutation.isPending} disabled={!title.trim()}>
          افزودن
        </Button>
      </form>

      <LoadingAndRetry query={getFileLabelsQuery}>
        <ul className="grid lg:grid-cols-2 gap-4">
          {labels.length === 0 && <li>برچسبی ثبت نشده است.</li>}
          {labels.map((label) => (
            <li
              key={label.id}
              className="flex items-center justify-between bg-white rounded shadow p-3"
            >
              {editingId === label.id ? (
                <>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 ml-2"
                    floatError={true}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleEditSave(label.id)}
                    loading={updateMutation.isPending && updateMutation.variables?.id === label.id}
                    className="ml-2"
                  >
                    ذخیره
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleEditCancel}>
                    لغو
                  </Button>
                </>
              ) : (
                <>
                  <span>{label.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-auto ml-4"
                    onClick={() => handleEditClick(label.id, label.title)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(label.id)}
                    loading={deleteMutation.isPending && deleteMutation.variables === label.id}
                  >
                    حذف
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </LoadingAndRetry>
    </div>
  )
}
