import { useState } from 'react'
import { templateGenerator } from './utils'
import { SelectCity, useGetDistrict, useGetRegions } from '@/features/misc'
import { useSendFileToRealtorByCategory } from '../../api/send-file-to-realtor'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { DocumentEditIcon } from '@/components/icons'

export const SendFileByCategory = ({ file, onSuccess }) => {
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [template, setTemplate] = useState(templateGenerator(file))
  const [customTemplate, setCustomTemplate] = useState('')

  const { data: regions = [] } = useGetRegions(selectedCity, { enabled: !!selectedCity })
  const regionOptions = regions.map((region) => ({
    label: `منطقه ${region}`,
    value: String(region),
  }))

  const { data: districts = [] } = useGetDistrict(selectedCity, { enabled: !!selectedCity })
  const districtOptions = districts.map((district) => ({
    label: district.name,
    value: String(district.id),
  }))

  const sendFileMutation = useSendFileToRealtorByCategory({
    onSuccess: () => {
      toast.success('فایل با موفقیت ارسال شد')
      onSuccess?.()
    },
    onError: handleErrorOnSubmit,
  })

  const handleEditClick = () => {
    setCustomTemplate(template)
    setIsEditing(true)
  }

  const handleSave = () => {
    setTemplate(customTemplate)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCustomTemplate('')
  }

  const handleSendFile = (sendType) => {
    if (!selectedCity || !template.trim()) {
      toast.error('لطفا همه فیلدها را پر کنید')
      return
    }

    const payload = {
      send_type: sendType,
      file_id: file?.id || 0,
      city_id: selectedCity || 0,
      district_id: selectedDistrict || 0,
      region: selectedRegion || 0,
      text: template.trim(),
    }

    sendFileMutation.mutate(payload)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SelectCity
          label="شهر"
          value={selectedCity}
          onChange={(value) => {
            setSelectedRegion(null)
            setSelectedDistrict(null)
            setSelectedCity(value)
          }}
        />
        <Select
          asValue
          label="منطقه"
          value={selectedRegion}
          onChange={setSelectedRegion}
          options={regionOptions}
        />
        <Select
          asValue
          searchable
          label="محله"
          value={selectedDistrict}
          onChange={setSelectedDistrict}
          options={districtOptions}
        />
      </div>

      <div className="p-2.5 bg-gray-100 rounded-lg flex flex-col gap-2.5">
        <div className="flex justify-between">
          <span className="text-teal-600 font-medium">متن پیام:</span>
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
            >
              ویرایش
              <DocumentEditIcon size={20} />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                size="sm"
                className="text-red-600 hover:text-red-700 transition-colors"
                onClick={handleCancel}
              >
                لغو
              </button>
              <button
                size="sm"
                className="text-teal-600 hover:text-teal-700 transition-colors"
                onClick={handleSave}
              >
                ذخیره
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <Input
            multiline
            floatError
            value={customTemplate}
            onChange={(e) => setCustomTemplate(e.target.value)}
            inputClassName="!h-44 text-sm fa"
            placeholder="متن پیام خود را اینجا بنویسید..."
          />
        ) : (
          <div className="whitespace-pre-line text-sm fa leading-relaxed">{template}</div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSendFile('DING')}
          disabled={sendFileMutation.isPending || !selectedCity || !template.trim()}
        >
          {sendFileMutation.isPending ? 'در حال ارسال...' : 'ارسال از طریق ایتا'}
        </Button>

        <Button
          size="sm"
          onClick={() => handleSendFile('SMS')}
          disabled={sendFileMutation.isPending || !selectedCity || !template.trim()}
        >
          {sendFileMutation.isPending ? 'در حال ارسال...' : 'ارسال پیامکی'}
        </Button>
      </div>
    </div>
  )
}
