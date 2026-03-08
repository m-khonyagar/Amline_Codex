import { useState } from 'react'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { SendFileByCategory } from './SendFileByCategory'
import { SendFileByIds } from './SendFileByIds'

export const SendFileDialog = ({ file, onSuccess }) => {
  const [value, setValue] = useState({ value: 'category' })

  return (
    <div>
      <SegmentedControl
        name="send-file-dialog"
        segments={[
          { label: 'بر اساس محله', value: 'category' },
          { label: 'اختصاصی', value: 'ids' },
        ]}
        value={value}
        onChange={setValue}
      />

      <div className="mt-6">
        {value.value === 'category' ? (
          <SendFileByCategory file={file} onSuccess={onSuccess} />
        ) : (
          <SendFileByIds file={file} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  )
}
