import Image from 'next/image'
import { useEffect, useState } from 'react'
import CommercialSvg from '@/assets/images/commercial.svg'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthContext } from '@/features/auth'
import { handleErrorOnSubmit } from '@/utils/error'
import usePatchNickname from '../api/patch-nickname'
import { BottomCTA } from '@/features/app'
import { fullName } from '@/utils/dom'

function NicknameStep({ onDone, onClose, loading }) {
  const { currentUser } = useAuthContext()

  const [nickName, setNickName] = useState()

  const updateNicknameMutation = usePatchNickname()

  useEffect(() => {
    const defaultName = currentUser?.nick_name || fullName(currentUser)
    setNickName(defaultName || '')
  }, [currentUser])

  const onSubmit = (callback) => {
    if (currentUser.nick_name !== nickName) {
      updateNicknameMutation.mutate(
        {
          nick_name: nickName,
        },
        {
          onSuccess: () => {
            callback()
          },
          onError: (err) => {
            handleErrorOnSubmit(err)
          },
        }
      )
    } else {
      callback()
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background px-6 -mb-8">
      <div className="flex flex-col justify-center items-center gap-y-5 m-auto">
        <Image src={CommercialSvg.src} alt="" width={100} height={100} />
        <h3 className="text-primary font-medium">نیازمندی شما با چه نامی منتشر شود؟</h3>
        <Input
          name="name"
          value={nickName}
          className="w-[264px] max-w-full"
          placeholder="مثال: ستاره کمالی"
          onChange={(e) => setNickName(e.target.value)}
        />
      </div>

      <BottomCTA>
        <div className="flex gap-4">
          <Button
            className="w-full"
            variant="outline"
            disabled={nickName?.length === 0 || updateNicknameMutation.isPending || loading}
            onClick={() => onSubmit(onClose)}
          >
            پیش نمایش
          </Button>
          <Button
            className="w-full"
            loading={updateNicknameMutation.isPending || loading}
            disabled={nickName?.length === 0}
            onClick={() => onSubmit(onDone)}
          >
            انتشار نیازمندی
          </Button>
        </div>
      </BottomCTA>
    </div>
  )
}

export default NicknameStep
