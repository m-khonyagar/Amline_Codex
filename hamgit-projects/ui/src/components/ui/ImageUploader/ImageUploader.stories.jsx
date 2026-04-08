import { useState } from 'react'
import ImageUploader from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: ImageUploader,
  args: {
    accept: ['image/png', 'image/jpeg'],
    maxSizeMB: 15,
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => {
    const [changeLog, setChangeLog] = useState([])

    return (
      <div>
        <ImageUploader
          {...args}
          onChange={(v) =>
            setChangeLog((s) => [
              ...s,
              { date: new Date(), value: v.map((f) => ({ name: f.name, size: f.size, ...f })) },
            ])
          }
        />
        <div dir="ltr" className="text-left mt-6">
          <div className="font-bold">change log:</div>
          {changeLog.length === 0 ? (
            'select at least one file to see change log'
          ) : (
            <pre className="bg-gray-100 text-left divide-y">
              {changeLog.map((change) => (
                <div className="flex flex-col px-4 py-2">
                  <span className="text-gray-500 text-xs">
                    {change.date.toTimeString().substr(0, 8)}:
                  </span>
                  <span className="whitespace-break-spaces text-sm font-mono">
                    {JSON.stringify(change.value, null, 2)}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>
    )
  },
  args: {
    label: 'تصویر سند',
    previewRatio: 40 / 100,
    maxImageCount: 10,
    uploadRequest: () =>
      new Promise((resolve) => {
        setTimeout(resolve, 2000)
      }),
  },
}
