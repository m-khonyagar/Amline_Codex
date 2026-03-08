import { useState } from 'react'
import { format } from 'date-fns-jalali'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useGetRequirementInfo } from '../api/get-requirement-info'
import {
  useAcceptRequirement,
  useDeArchiveRequirement,
  useRejectRequirement,
} from '../api/status-requirement'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import { numberSeparator } from '@/utils/number'
import { AdStatusEnums, RequirementTypeEnums } from '@/data/enums/requirement_enums'
import { intersperse } from '@/utils/dom'
import { AdPropertyTypeTranslation, AdStatusEnumsTranslations } from '@/data/enums/ads_enums'
import { Dialog } from '@/components/ui/Dialog'
import RequirementsListDelete from './RequirementsList/RequirementsListDelete'

const formattedDate = (date, formatStr) =>
  date ? format(date.toString(), formatStr || 'HH:mm   yyyy-MM-dd') : '--'

const RequirementInfo = ({ requirementId }) => {
  const getRequirementQuery = useGetRequirementInfo(requirementId)
  const navigate = useNavigate()

  const requirement = getRequirementQuery.data || {}

  const isArchived = requirement?.status === AdStatusEnums.ARCHIVED
  const isAccepted = requirement?.status === AdStatusEnums.PUBLISHED

  const deArchiveRequirement = useDeArchiveRequirement()
  const acceptRequirement = useAcceptRequirement()
  const rejectRequirement = useRejectRequirement()

  const [selectedRequirementForDelete, setSelectedRequirementForDelete] = useState(null)

  const handleDeArchive = () => {
    deArchiveRequirement.mutate(requirement.id, {
      onSuccess: () => toast.success('آگهی با موفقیت بازیابی شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleAccept = () => {
    acceptRequirement.mutate(requirement.id, {
      onSuccess: () => toast.success('نیازمندی با موفقیت منتشر شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleReject = () => {
    rejectRequirement.mutate(requirement.id, {
      onSuccess: () => toast.success('نیازمندی با موفقیت رد شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleDelete = () => setSelectedRequirementForDelete(requirement)

  const tableData = [
    ['شناسه', requirement.id],
    ['نوع', AdPropertyTypeTranslation[requirement.type]],
    ['وضعیت', AdStatusEnumsTranslations[requirement.status]],
    ['عنوان', requirement.title],
    ['موبایل', requirement.mobile],
    ['شهر', requirement.city?.name],
    [
      'محله',
      intersperse(
        (requirement.districts_list || []).map((district) => district?.name),
        ' , '
      ),
    ],
    ['تعداد اتاق', requirement.room_count],
    ['حداقل متراژ', requirement.min_size],
    ['آسانسور', requirement.elevator ? 'دارد' : 'ندارد'],
    ['انباری', requirement.storage_room ? 'دارد' : 'ندارد'],
    ['پارکینگ', requirement.parking ? 'دارد' : 'ندارد'],
    ['مهلت مستاجر', formattedDate(requirement.tenant_deadline, 'yyyy/MM/dd')],
    ['ایجاد شده توسط ادمین', requirement.created_by_admin ? 'بله' : 'خیر'],
    ['توضیحات', requirement.description],
    ['تاریخ تایید', formattedDate(requirement.accepted_at)],
    ['تاریخ رد', formattedDate(requirement.rejected_at)],
    ['گزارش تخلف', requirement.report_description],
    requirement.type === RequirementTypeEnums.FOR_SALE
      ? ['قیمت کل', numberSeparator(requirement.sale_price)]
      : ['حداکثر رهن', numberSeparator(requirement.max_deposit)],
    requirement.type === RequirementTypeEnums.FOR_SALE
      ? ['سال ساخت', formattedDate(requirement.construction_year, 'yyyy')]
      : ['حداکثر اجاره', numberSeparator(requirement.max_rent)],
  ]

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          href={`/requirements/buy-and-rental/${requirementId}/edit`}
        >
          ویرایش
        </Button>

        {isArchived ? (
          <Button onClick={handleDeArchive} size="sm" loading={acceptRequirement.isPending}>
            بازیابی
          </Button>
        ) : isAccepted ? (
          <Button
            onClick={handleReject}
            size="sm"
            variant="danger"
            loading={rejectRequirement.isPending}
          >
            لغو انتشار
          </Button>
        ) : (
          <Button onClick={handleAccept} size="sm" loading={acceptRequirement.isPending}>
            انتشار
          </Button>
        )}

        <Button onClick={handleDelete} size="sm" variant="danger">
          حذف
        </Button>
      </div>

      <div className="max-w-[450px] w-full">
        <div className="bg-white border rounded-lg divide-y fa">
          <LoadingAndRetry query={getRequirementQuery}>
            {requirement && (
              <>
                {tableData.map((item, index) => (
                  <div key={index} className="flex items-center py-2 px-4 flex-wrap">
                    <div className="text-sm text-gray-700 py-1">{item[0]}</div>
                    <div className="mr-auto py-1">{item[1] || '--'}</div>
                  </div>
                ))}
              </>
            )}
          </LoadingAndRetry>
        </div>
      </div>

      <Dialog
        title="حذف نیازمندی"
        closeOnBackdrop={false}
        open={selectedRequirementForDelete}
        onOpenChange={(s) => setSelectedRequirementForDelete(s)}
      >
        <RequirementsListDelete
          requirement={selectedRequirementForDelete}
          onCancel={() => setSelectedRequirementForDelete(null)}
          onSuccess={() => {
            setSelectedRequirementForDelete(null)
            navigate(-1)
          }}
        />
      </Dialog>
    </div>
  )
}

export default RequirementInfo
