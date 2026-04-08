import { useState } from 'react'
import Table from '@/components/ui/Table/Table'
import TableBody from '@/components/ui/Table/TableBody'
import TableCell from '@/components/ui/Table/TableCell'
import TableHead from '@/components/ui/Table/TableHead'
import TableRow from '@/components/ui/Table/TableRow'
import { FileConnectionStatusOptions, MarketRole } from '@/data/enums/market_enums'
import { findOption } from '@/utils/enum'
import { useGetFileConnections } from '../../api/get-file-connections'
import { useDeleteFileConnection } from '../../api/delete-file-connection'
import { Badge } from '@/components/ui/Badge'
import { numberSeparator } from '@/utils/number'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { MoreHorizontalIcon } from '@/components/icons'
import { Link } from 'react-router-dom'
import { EditFileConnection } from './EditFileConnection'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { FileConnectionHistory } from './FileConnectionHistory'

export const FileConnectionsList = ({ fileId, role }) => {
  const [fileConnection, setFileConnection] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  const isLandlord = role === MarketRole.LANDLORD
  const queryParams = isLandlord ? { landlord_file_id: fileId } : { tenant_file_id: fileId }

  const { data: connectionsResponse, isLoading } = useGetFileConnections(queryParams)
  const connections = connectionsResponse?.data || []

  const deleteConnectionMutation = useDeleteFileConnection({
    onSuccess: () => toast.success('اتصال با موفقیت حذف شد'),
    onError: handleErrorOnSubmit,
  })

  const handleDeleteConnection = (connectionId) => {
    if (confirm('آیا از حذف این اتصال اطمینان دارید؟')) {
      deleteConnectionMutation.mutate(connectionId)
    }
  }

  const handleEditConnection = (connection) => {
    setFileConnection(connection)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setFileConnection(null)
  }

  const handleFileConnectionHistory = (connection) => {
    setFileConnection(connection)
    setIsHistoryDialogOpen(true)
  }

  return (
    <div className="space-y-4 fa">
      {isLoading ? (
        <div className="text-center py-8">در حال بارگذاری...</div>
      ) : connections?.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <thead>
              <TableRow>
                <TableHead>وضعیت اتصال</TableHead>
                <TableHead>شماره تلفن {isLandlord ? 'مستاجر' : 'مالک'}</TableHead>
                <TableHead>نام و نام خانوادگی</TableHead>
                <TableHead>مبلغ رهن</TableHead>
                <TableHead>مبلغ اجاره</TableHead>
                <TableHead>متراژ</TableHead>
                <TableHead>اتاق</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>محل</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </thead>
            <TableBody>
              {connections.map((connection) => {
                const connectedFile = isLandlord ? connection.tenant_file : connection.landlord_file
                const statusOption = findOption(FileConnectionStatusOptions, connection.status)

                return (
                  <TableRow key={connection.id}>
                    <TableCell>
                      <Badge variant={statusOption?.variant}>{statusOption?.label}</Badge>
                    </TableCell>
                    <TableCell>{connectedFile?.mobile}</TableCell>
                    <TableCell>{connectedFile?.full_name}</TableCell>
                    <TableCell>{numberSeparator(connectedFile?.deposit || 0)}</TableCell>
                    <TableCell>{numberSeparator(connectedFile?.rent || 0)}</TableCell>
                    <TableCell>{connectedFile?.area || '-'}</TableCell>
                    <TableCell>{connectedFile?.room_count || '-'}</TableCell>
                    <TableCell>{connectedFile?.city?.name || '-'}</TableCell>
                    <TableCell>
                      {connectedFile?.districts?.map((d) => d.name).join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
                            <MoreHorizontalIcon />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent dir="rtl" align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/market/deposit-rent/${isLandlord ? MarketRole.TENANT : MarketRole.LANDLORD}/${connectedFile.id}`}
                            >
                              مشاهده
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleEditConnection(connection)}>
                            ویرایش
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleFileConnectionHistory(connection)}>
                            تاریخچه
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteConnection(connection.id)}
                            className="text-red-600 hover:text-red-800 focus:text-red-800 focus:bg-red-50"
                          >
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">هیچ اتصالی برای این فایل یافت نشد</div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="ویرایش وضعیت">
        <EditFileConnection
          connection={fileConnection}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>

      <Dialog
        className="max-w-5xl"
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        title="تاریخچه"
      >
        <FileConnectionHistory
          fileConnectionId={fileConnection?.id}
          onClose={() => setIsHistoryDialogOpen(false)}
        />
      </Dialog>
    </div>
  )
}
