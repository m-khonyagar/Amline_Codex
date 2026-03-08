import DatePicker from './DatePicker'

/** @type { import('@storybook/react').Meta } */
export default {
  component: DatePicker,
  args: {
    dayPicker: true,
    monthPicker: true,
    yearPicker: true,
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <DatePicker {...args} />,
  args: {},
}
