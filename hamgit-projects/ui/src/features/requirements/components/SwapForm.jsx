import { Form, InputField, InputNumberField } from '@/components/ui/Form'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'

function SwapForm({ onDone, methods }) {
  return (
    <div className="px-6 mt-6 flex flex-col gap-4">
      <Form methods={methods} onSubmit={onDone} className="flex flex-col gap-2">
        <div className="bg-background rounded-2xl p-4 shadow-xl">
          <InputField label="عنوان" name="title" required placeholder="معاوضه آپارتمان با خودرو" />

          <InputField
            multiline
            label="چی دارم"
            name="have"
            required
            placeholder="یه خونه نقلی دارم تو جمهوری، 75 متر، طبقه اول جنوبی، نورگیر عالی، پارکینگ، دارای سند پنج برگی معتبر قابل استعلام و ..."
          />

          <InputNumberField
            required
            name="price"
            label="قیمت"
            suffix="تومان"
            decimalSeparator="/"
            placeholder="200,000,000"
          />
        </div>

        <div className="bg-background rounded-2xl p-4 shadow-xl">
          <InputField
            multiline
            label="چی میخوام"
            name="want"
            required
            placeholder="معاوضه فقط با خودرو ایرانی دارم. اگر قیمت خودرو کمتر باشه مابه تفاوت فقط نقد"
          />
        </div>

        <BottomCTA>
          <Button className="w-full" type="submit">
            ثبت
          </Button>
        </BottomCTA>
      </Form>
    </div>
  )
}

export default SwapForm
