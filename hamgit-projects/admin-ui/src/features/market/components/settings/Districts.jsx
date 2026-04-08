import { useState } from 'react'
import useGetDistrict, {
  useCreateDistrict,
  useUpdateDistrict,
  useDeleteDistrict,
} from '@/data/api/districts'
import { SelectCity } from '@/features/misc'
import Input from '@/components/ui/Input'
import InputNumber from '@/components/ui/InputNumber'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'

export const Districts = () => {
  const [cityId, setCityId] = useState('')
  const [districtData, setDistrictData] = useState({ name: '', region: '' })
  const [editingDistrict, setEditingDistrict] = useState(null)

  const districtsQuery = useGetDistrict(cityId, { enabled: !!cityId })
  const createMutation = useCreateDistrict(cityId, {
    onSuccess: () => districtsQuery.refetch(),
    onError: handleErrorOnSubmit,
    enabled: !!cityId && !editingDistrict,
  })
  const updateMutation = useUpdateDistrict({
    onSuccess: () => districtsQuery.refetch(),
    onError: handleErrorOnSubmit,
    enabled: !!cityId && editingDistrict,
  })
  const deleteMutation = useDeleteDistrict({
    onSuccess: () => districtsQuery.refetch(),
    onError: handleErrorOnSubmit,
  })

  const handleCityChange = (cityId) => {
    setCityId(cityId)
    setDistrictData({ name: '', region: '' })
    setEditingDistrict(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!districtData.name.trim()) return

    const submitData = {
      name: districtData.name,
      region: parseInt(districtData.region) || undefined,
    }

    if (editingDistrict) {
      updateMutation.mutate({ districtId: editingDistrict.id, data: submitData })
      setEditingDistrict(null)
    } else createMutation.mutate(submitData)

    setDistrictData({ name: '', region: '' })
  }

  const handleEdit = (district) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setEditingDistrict(district)
    setDistrictData({ name: district.name, region: district.region ?? '' })
  }

  const handleDelete = (districtId) => {
    if (window.confirm('آیا مطمئن هستید؟')) {
      deleteMutation.mutate(districtId)
    }
  }

  return (
    <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg px-6 py-10 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">مدیریت محله ها</h2>

      <div className="mb-6">
        <SelectCity label="شهر" value={cityId} onChange={handleCityChange} />
      </div>

      {cityId && (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
            <Input
              label="نام محله"
              value={districtData.name}
              onChange={(e) => setDistrictData({ ...districtData, name: e.target.value })}
              placeholder="نام محله را وارد کنید"
              floatError
              required
            />
            <InputNumber
              label="منطقه"
              value={districtData.region}
              onChange={(e) => setDistrictData({ ...districtData, region: e.target.value })}
              placeholder="شماره منطقه را وارد کنید"
              floatError
              allowNegative={false}
            />
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="w-full"
            >
              {editingDistrict ? 'ویرایش محله' : 'افزودن محله'}
            </Button>
          </form>

          <hr className="mb-6" />

          {districtsQuery.isLoading ? (
            <div className="text-center text-gray-500">در حال بارگذاری...</div>
          ) : districtsQuery.data?.length === 0 ? (
            <div className="text-center text-gray-400">هیچ منطقه‌ای ثبت نشده است.</div>
          ) : (
            <ul className="grid lg:grid-cols-2 gap-4">
              {districtsQuery.data?.map((district) => (
                <li
                  key={district.id}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{district.name}</span>
                    {district.region && (
                      <span className="text-sm text-gray-500 fa">منطقه: {district.region}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleEdit(district)}
                      className="bg-yellow-400 hover:bg-yellow-500"
                    >
                      ویرایش
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(district.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
