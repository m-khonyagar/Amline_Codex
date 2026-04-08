import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useCopy } from '@/hooks/use-copy'
import { CopyIcon, PhoneIcon, CopyCheckIcon, CirclePhoneIcon } from '@/components/icons'
import Tooltip from '@/components/ui/tooltip'

function RequirementContactModal({ requirement, open, onClose }) {
  const { isCopied, copy } = useCopy()

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="!p-0 w-full max-w-sm !rounded-2xl overflow-hidden"
    >
      <div className="bg-[#F6FBFB] p-4 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2">
          <CirclePhoneIcon size={36} />
          {/* <p className="font-semibold text-lg text-center">{requirement?.nick_name}</p> */}
        </div>

        <div className="flex justify-center items-center gap-2 mt-3.5">
          <div>شماره موبایل: </div>
          <div>{requirement?.mobile}</div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-3.5">
          <Button
            size="sm"
            variant="gray"
            target="_blank"
            href={`tel:${requirement.mobile}`}
            className="flex gap-2 basis-1/2"
          >
            <PhoneIcon size={20} />
            تماس
          </Button>

          <Tooltip open={open && isCopied} content="کپی شد" className="basis-1/2" asChild>
            <Button
              size="sm"
              onClick={() => copy(requirement.mobile)}
              className="flex gap-2 w-full"
            >
              {isCopied ? <CopyCheckIcon size={20} /> : <CopyIcon size={20} />}
              کپی کردن
            </Button>
          </Tooltip>
        </div>
      </div>
    </Modal>
  )
}

export default RequirementContactModal
