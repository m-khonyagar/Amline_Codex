import { useState } from 'react'
import { cn } from '@/utils/dom'
import { templateGenerator } from './utils'
import { useGetRealtorFiles } from '../../api/get-realtor-files'
import { SpecializationLabels, SpecializationOptions } from '@/data/enums/market_enums'
import { SelectCity, useGetDistrict, useGetRegions } from '@/features/misc'
import { useSendFileToRealtorByIds } from '../../api/send-file-to-realtor'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CheckmarkIcon, DocumentEditIcon } from '@/components/icons'

export const SendFileByIds = ({ file, onSuccess }) => {
  const [filter, setFilter] = useState({
    search: '',
    mobile: '',
    specialization: '',
    city_ids_str: '',
    district_ids_str: '',
    regions_str: '',
  })
  const [step, setStep] = useState('search') // search, select, send
  const [selectedRealtors, setSelectedRealtors] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [template, setTemplate] = useState(templateGenerator(file))
  const [customTemplate, setCustomTemplate] = useState('')

  const realtorFilesQuery = useGetRealtorFiles(
    {
      limit: 1000,
      search: filter.search || null,
      mobile: filter.mobile || null,
      specialization: filter.specialization || null,
      city_ids_str: filter.city_ids_str || null,
      district_ids_str: filter.district_ids_str || null,
      regions_str: filter.regions_str || null,
    },
    { enabled: step === 'select' }
  )

  const { data: regions = [] } = useGetRegions(filter.city_ids_str, {
    enabled: !!filter.city_ids_str,
  })
  const regionOptions = regions.map((region) => ({
    label: `منطقه ${region}`,
    value: String(region),
  }))

  const { data: districts = [] } = useGetDistrict(filter.city_ids_str, {
    enabled: !!filter.city_ids_str,
  })
  const districtOptions = districts.map((district) => ({
    label: district.name,
    value: String(district.id),
  }))

  const sendFileMutation = useSendFileToRealtorByIds({
    onSuccess: () => {
      toast.success('فایل با موفقیت ارسال شد')
      onSuccess?.()
    },
    onError: handleErrorOnSubmit,
  })

  const handleSelectRealtor = (realtorId) => {
    setSelectedRealtors((prev) =>
      prev.includes(realtorId) ? prev.filter((id) => id !== realtorId) : [...prev, realtorId]
    )
  }

  const handleSelectAll = () => {
    const realtorData = realtorFilesQuery.data?.data || []
    if (selectedRealtors.length === realtorData.length) {
      setSelectedRealtors([])
    } else {
      setSelectedRealtors(realtorData.map((realtor) => realtor.id))
    }
  }

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
    if (selectedRealtors.length === 0 || !template.trim()) {
      toast.error('لطفا حداقل یک مشاور املاک انتخاب کنید و متن پیام را پر کنید')
      return
    }

    const payload = {
      send_type: sendType,
      file_id: file?.id || 0,
      realtor_file_ids: selectedRealtors,
      text: template.trim(),
    }

    sendFileMutation.mutate(payload)
  }

  const realtorData = realtorFilesQuery.data?.data || []
  const isAllSelected = realtorData.length > 0 && selectedRealtors.length === realtorData.length

  return (
    <div>
      {step !== 'send' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SearchInput
            label="نام و نام‌خانوادگی"
            placeholder="جستجو"
            initialValue={filter.search}
            onSubmit={(value) => setFilter((prev) => ({ ...prev, search: value }))}
          />
          <SearchInput
            label="شماره تلفن"
            placeholder="جستجو"
            initialValue={filter.mobile}
            onSubmit={(value) => setFilter((prev) => ({ ...prev, mobile: value }))}
          />
          <Select
            asValue
            label="حوزه فعالیت"
            value={filter.specialization}
            onChange={(value) => setFilter((prev) => ({ ...prev, specialization: value }))}
            options={[{ label: 'همه', value: null }, ...SpecializationOptions]}
          />
          <SelectCity
            label="شهر"
            value={filter.city_ids_str}
            onChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                city_ids_str: value,
                district_ids_str: '',
                regions_str: '',
              }))
            }
          />
          <Select
            asValue
            label="منطقه"
            value={filter.regions_str}
            onChange={(value) => setFilter((prev) => ({ ...prev, regions_str: value }))}
            options={regionOptions}
          />
          <Select
            asValue
            searchable
            label="محله"
            value={filter.district_ids_str}
            onChange={(value) => setFilter((prev) => ({ ...prev, district_ids_str: value }))}
            options={districtOptions}
          />
        </div>
      )}

      {step === 'select' && realtorData.length > 0 && (
        <div className="border rounded-lg max-h-60 overflow-y-auto overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <button
                    onClick={handleSelectAll}
                    className={cn(
                      'flex items-center justify-center size-5 border rounded',
                      isAllSelected && 'bg-teal-600'
                    )}
                  >
                    {isAllSelected && <CheckmarkIcon size={15} color="white" />}
                  </button>
                </TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>نام املاک</TableHead>
                <TableHead>حوزه فعالیت</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>مناطق تحت پوشش</TableHead>
                <TableHead>محله</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {realtorData.map((realtor) => (
                <TableRow key={realtor.id}>
                  <TableCell>
                    <button
                      onClick={() => handleSelectRealtor(realtor.id)}
                      className={cn(
                        'flex items-center justify-center size-5 border rounded',
                        selectedRealtors.includes(realtor.id) && 'bg-teal-600'
                      )}
                    >
                      {selectedRealtors.includes(realtor.id) && (
                        <CheckmarkIcon size={15} color="white" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="fa">{realtor.full_name || '-'}</TableCell>
                  <TableCell className="fa">{realtor.office_name || '-'}</TableCell>
                  <TableCell className="fa">
                    {SpecializationLabels[realtor.specialization]}
                  </TableCell>
                  <TableCell className="fa">
                    {realtor.city?.province && realtor.city?.name
                      ? `${realtor.city.province} - ${realtor.city.name}`
                      : '-'}
                  </TableCell>
                  <TableCell className="fa">{realtor.regions?.join(' - ') || '-'}</TableCell>
                  <TableCell className="fa">
                    {realtor.districts?.map((district) => district.name).join(' - ') || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {step === 'select' && realtorData.length === 0 && !realtorFilesQuery.isLoading && (
        <div className="text-center py-8 text-gray-500">هیچ مشاور املاکی یافت نشد</div>
      )}

      {step !== 'send' && (
        <div className="flex justify-end">
          {step === 'search' && (
            <Button
              size="sm"
              onClick={() => setStep('select')}
              loading={realtorFilesQuery.isLoading}
            >
              جستجو
            </Button>
          )}
          {step === 'select' && (
            <Button size="sm" onClick={() => setStep('send')}>
              مرحله بعد
            </Button>
          )}
        </div>
      )}

      {step === 'send' && (
        <>
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
              disabled={sendFileMutation.isPending || !template.trim()}
            >
              {sendFileMutation.isPending ? 'در حال ارسال...' : 'ارسال از طریق ایتا'}
            </Button>

            <Button
              size="sm"
              onClick={() => handleSendFile('SMS')}
              disabled={sendFileMutation.isPending || !template.trim()}
            >
              {sendFileMutation.isPending ? 'در حال ارسال...' : 'ارسال پیامکی'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
