import DatePicker from '@/components/ui/DatePicker.jsx'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'

export default function DateTimePicker(props) {
  return (
    <DatePicker
      format="YYYY MM DD -- HH:mm:ss"
      inputFormat="yyyy/MM/dd HH:mm:ss"
      outputFormat="YYYY-MM-DD HH:mm:ss"
      plugins={[<TimePicker key="01" position="bottom" />]}
      {...props}
    />
  )
}
