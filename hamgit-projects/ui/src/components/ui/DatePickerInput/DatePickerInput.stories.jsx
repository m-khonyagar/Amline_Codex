import DatePickerInput from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: DatePickerInput,
  args: {
    format: 'd MMMM yyyy',
    valueFormat: 'iso',
    dayPicker: true,
    monthPicker: true,
    yearPicker: true,
  },
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <DatePickerInput {...args} />,
  args: {
    label: 'تاریخ تولد',
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const YearPicker = {
  render: (args) => <DatePickerInput {...args} />,
  args: {
    format: 'yyyy',
    label: 'سال ساخت',
    dayPicker: false,
    monthPicker: false,
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const DayPicker = {
  render: (args) => <DatePickerInput {...args} />,
  args: {
    format: 'd  هرماه',
    label: 'روز',
    daySuffix: 'هر ماه',
    monthPicker: false,
    yearPicker: false,
  },
}
