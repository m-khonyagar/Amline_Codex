import { useState } from 'react'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  useGetFileSources,
  useCreateFileSource,
  useUpdateFileSource,
  useDeleteFileSource,
} from '../../api/file-sources'
import { PencilIcon } from '@/components/icons'

export const FileSources = () => {
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const getFileSourcesQuery = useGetFileSources()
  const { data: sources = [], refetch } = getFileSourcesQuery

  const createMutation = useCreateFileSource({
    onSuccess: () => {
      setTitle('')
      refetch()
    },
  })

  const updateMutation = useUpdateFileSource({
    onSuccess: refetch,
  })

  const deleteMutation = useDeleteFileSource({
    onSuccess: refetch,
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createMutation.mutate({ title })
  }

  const handleEditClick = (id, currentTitle) => {
    setEditingId(id)
    setEditingTitle(currentTitle)
  }

  const handleEditSave = (id) => {
    if (!editingTitle.trim()) return
    updateMutation.mutate(
      { id, title: editingTitle },
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
    if (window.confirm('مطمعن هستی که میخوای این منبع را حذف کنی؟')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg px-6 py-10 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">مدیریت منابع فایل</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 lg:w-1/2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان منبع فایل جدید"
          className="flex-1"
        />
        <Button type="submit" loading={createMutation.isPending} disabled={!title.trim()}>
          افزودن
        </Button>
      </form>

      <LoadingAndRetry query={getFileSourcesQuery}>
        <ul className="grid lg:grid-cols-2 gap-4">
          {sources.length === 0 && <li>منبعی ثبت نشده است.</li>}
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex items-center justify-between bg-white rounded shadow p-3"
            >
              {editingId === source.id ? (
                <>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 ml-2"
                    floatError={true}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleEditSave(source.id)}
                    loading={updateMutation.isPending && updateMutation.variables?.id === source.id}
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
                  <span>{source.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-auto ml-4"
                    onClick={() => handleEditClick(source.id, source.title)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(source.id)}
                    loading={deleteMutation.isPending && deleteMutation.variables === source.id}
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
