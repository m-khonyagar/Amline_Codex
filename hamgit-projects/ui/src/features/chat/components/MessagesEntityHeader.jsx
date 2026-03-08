import { HouseIcon } from '@/components/icons'
import { Skeleton } from '@/components/ui/Skeleton'
import { EntityTypeEnums } from '@/data/enums/entity_type_enums'
import { getRequirementTitle } from '@/features/requirements'
import { cn } from '@/utils/dom'

function MessagesEntityHeader({ className, entity, entityType, isLoading }) {
  return (
    <div className={cn('flex items-center gap-4 px-4 py-2 border rounded-lg', className)}>
      {isLoading && (
        <>
          <Skeleton className="rounded-md h-[27px] w-[27px]" />

          <div className="flex-grow">
            <Skeleton className="rounded w-4/12 h-4" />
          </div>
        </>
      )}

      {!isLoading && entity && (
        <>
          <div className="p-1 border rounded-md">
            <HouseIcon size={18} className="text-gray-300" />
          </div>

          <span className="text-gray-500 text-sm">
            {entityType === EntityTypeEnums.REQUIREMENT &&
              `نیازمندی ${getRequirementTitle(entity.type, entity.property_type)} در ${entity?.city?.name}`}
          </span>
        </>
      )}
    </div>
  )
}

export default MessagesEntityHeader
