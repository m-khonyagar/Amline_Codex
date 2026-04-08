import Select from './index'

const options = [
  { label: 'دولتی', value: 1 },
  { label: 'فلان', value: 2 },
  { label: 'بهمان', value: 3 },
  { label: 'سلام', value: 4 },
  { label: 'چه جالب', value: 5 },
]

/** @type { import('@storybook/react').Meta } */
export default {
  component: Select,
}

/** @type {import('@storybook/react').StoryObj} */
export const SingleSelect = {
  render: (args) => <Select {...args} />,

  args: {
    label: 'شهر',
    modalTitle: 'شهر',
    name: 'test',
    placeholder: 'انتخاب کنید',
    helperText: 'شهر انتخابی می‌بایست با شهر محل سکونت یکی باشد',
    searchable: false,
    options,
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const MultiSelect = {
  render: (args) => <Select {...args} />,

  args: {
    label: 'شهر',
    modalTitle: 'شهر',
    name: 'test',
    placeholder: 'انتخاب کنید',
    helperText: 'شهر انتخابی می‌بایست با شهر محل سکونت یکی باشد',
    searchable: true,
    multiSelect: true,
    options,
  },
}
