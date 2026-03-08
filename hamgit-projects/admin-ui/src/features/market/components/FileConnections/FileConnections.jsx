import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import SearchInput from '@/components/ui/SearchInput'
import Table from '@/components/ui/Table/Table'
import TableBody from '@/components/ui/Table/TableBody'
import TableCell from '@/components/ui/Table/TableCell'
import TableHead from '@/components/ui/Table/TableHead'
import TableRow from '@/components/ui/Table/TableRow'
import { FileConnectionsList } from './FileConnectionsList'
import { MarketRole, MarketRoleLabels } from '@/data/enums/market_enums'
import { useGetTenantFiles } from '../../api/get-tenant-files'
import { useGetLandlordFiles } from '../../api/get-landlord-files'
import { useCreateFileConnection } from '../../api/create-file-connection'
import { useMatchLandlordFile, useMatchTenantFile } from '../../api/match-files'
import { handleErrorOnSubmit } from '@/utils/error'
import { downloadBlob } from '@/utils/file'
import { DownloadIcon, PlusIcon } from '@/components/icons'
import { numberSeparator } from '@/utils/number'

export const FileConnections = ({ data: { id, role, ...data } }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [matchedFiles, setMatchedFiles] = useState([])

  const isLandlord = role === MarketRole.LANDLORD || role === MarketRole.SELLER
  const searchTitle = `جستجوی فایل ${MarketRoleLabels[role]}`

  const filesQuery = {
    [MarketRole.LANDLORD]: useGetTenantFiles,
    [MarketRole.TENANT]: useGetLandlordFiles,
    [MarketRole.SELLER]: useGetTenantFiles,
    [MarketRole.BUYER]: useGetLandlordFiles,
  }[role]

  const { data: filesResponse, isLoading } = filesQuery(
    { search: search.trim() || null },
    { enabled: open && !!search.trim() }
  )

  const matchFileMutation = {
    [MarketRole.LANDLORD]: useMatchLandlordFile(),
    [MarketRole.TENANT]: useMatchTenantFile(),
    [MarketRole.SELLER]: useMatchLandlordFile(),
    [MarketRole.BUYER]: useMatchTenantFile(),
  }[role]

  const filesToDisplay = matchedFiles.length > 0 ? matchedFiles : filesResponse?.data || []
  const isLoadingFiles = matchedFiles.length > 0 ? matchFileMutation.isPending : isLoading

  // const downloadLandlordExcelMutation = useDownloadLandlordFilesExcel()
  // const downloadTenantExcelMutation = useDownloadTenantFilesExcel()

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm)
    setMatchedFiles([])
    setSelectedFiles([])
  }

  const handleSelectFile = (file) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((selected) => selected.id === file.id)
      if (isSelected) {
        return prev.filter((selected) => selected.id !== file.id)
      } else {
        return [...prev, file]
      }
    })
  }

  const createConnectionMutation = useCreateFileConnection({
    onSuccess: () => {
      setOpen(false)
      setSelectedFiles([])
      setSearch('')
    },
    onError: handleErrorOnSubmit,
  })

  const handleCreateConnection = () => {
    if (selectedFiles.length === 0) return

    const connectionsData = selectedFiles.map((selectedFile) => ({
      landlord_file_id: isLandlord ? id : selectedFile.id,
      tenant_file_id: isLandlord ? selectedFile.id : id,
      initiator: isLandlord ? 'LANDLORD' : 'TENANT',
    }))

    createConnectionMutation.mutate({ connections: connectionsData })
  }

  const handleMatchWithAI = () => {
    matchFileMutation.mutate(id, {
      onSuccess: (data) => {
        const matchedFilesData = data?.data || []
        setMatchedFiles(matchedFilesData)
        setSearch('')
        setSelectedFiles([])
      },
      onError: handleErrorOnSubmit,
    })
  }

  // const handleDownloadExcel = () => {
  //   if (isLandlord) {
  //     downloadTenantExcelMutation.mutate()
  //   } else {
  //     downloadLandlordExcelMutation.mutate()
  //   }
  // }

  const handleDownloadJson = () => {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const filename = `file-${id}-${role}.json`
    downloadBlob(blob, filename)
  }

  return (
    <div className="px-4">
      <div className="flex justify-between mb-6">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          ایجاد <PlusIcon size={20} className="mr-2" />
        </Button>

        <Button size="sm" onClick={handleDownloadJson}>
          خروجی <DownloadIcon size={20} className="mr-2" />
        </Button>
      </div>

      <FileConnectionsList fileId={id} role={role} />

      <Dialog open={open} onOpenChange={setOpen} title={searchTitle}>
        <div className="space-y-4">
          <SearchInput
            onSubmit={handleSearch}
            placeholder="جستجو بر اساس شماره تلفن..."
            defaultValue={search}
          />

          <Button
            variant="outline"
            onClick={handleMatchWithAI}
            loading={matchFileMutation.isPending}
            disabled={matchFileMutation.isPending}
          >
            تطبیق با هوش مصنوعی
          </Button>

          {isLoadingFiles ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : filesToDisplay?.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <thead>
                    <TableRow>
                      <TableHead>انتخاب</TableHead>
                      <TableHead>شماره تلفن {isLandlord ? 'مستاجر' : 'مالک'}</TableHead>
                      <TableHead>نام و نام خانوادگی</TableHead>
                      <TableHead>مبلغ رهن</TableHead>
                      <TableHead>مبلغ اجاره</TableHead>
                      <TableHead>متراژ</TableHead>
                      <TableHead>اتاق</TableHead>
                      <TableHead>شهر</TableHead>
                      <TableHead>محل</TableHead>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {filesToDisplay.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedFiles.some((selected) => selected.id === file.id)}
                            onChange={() => handleSelectFile(file)}
                            className="size-4"
                          />
                        </TableCell>
                        <TableCell>{file.mobile}</TableCell>
                        <TableCell>{file.full_name}</TableCell>
                        <TableCell>{numberSeparator(file.deposit || 0)}</TableCell>
                        <TableCell>{numberSeparator(file.rent || 0)}</TableCell>
                        <TableCell>{file.area || '-'}</TableCell>
                        <TableCell>{file.room_count || '-'}</TableCell>
                        <TableCell>{file.city?.name || '-'}</TableCell>
                        <TableCell>
                          {file.districts?.map((d) => d.name).join(', ') || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleCreateConnection}
                  disabled={selectedFiles.length === 0}
                  loading={createConnectionMutation.isPending}
                  className="px-8 fa"
                >
                  ثبت ({selectedFiles.length})
                </Button>
              </div>
            </div>
          ) : matchedFiles.length === 0 && matchFileMutation.isSuccess ? (
            <div className="text-center py-8 text-gray-500">
              هیچ فایل مطابقی با هوش مصنوعی یافت نشد
            </div>
          ) : search ? (
            <div className="text-center py-8 text-gray-500">فایلی با این مشخصات یافت نشد</div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              لطفاً جستجوی خود را انجام دهید یا از هوش مصنوعی استفاده کنید
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}
