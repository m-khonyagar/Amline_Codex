import { useState } from 'react'
import SegmentedControl from './index'
import { toast } from '../Toaster'

/** @type { import('@storybook/react').Meta } */
export default {
  component: SegmentedControl,
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <SegmentedControl {...args} />,
  args: {
    onDisabledClick: () => {
      toast('این گزینه قابل انتخاب نمی‌باشد')
    },
    segments: [
      {
        label: 'شخصی',
        value: 1,
      },
      {
        label: 'حقوقی',
        value: 2,
      },
      {
        label: 'سایر',
        value: 3,
        disabled: true,
      },
    ],
  },
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Controlled = {
  render: ({ value, ...args }) => {
    const [localValue, setLocalValue] = useState(value)
    return <SegmentedControl {...args} value={localValue} onChange={(v) => setLocalValue(v)} />
  },

  args: {
    onChange: () => {},
    value: {
      label: 'حقوقی',
      value: 2,
    },
    segments: [
      {
        label: 'شخصی',
        value: 1,
      },
      {
        label: 'حقوقی',
        value: 2,
      },
      {
        label: 'سایر',
        value: 3,
        disabled: true,
      },
    ],
  },
}
