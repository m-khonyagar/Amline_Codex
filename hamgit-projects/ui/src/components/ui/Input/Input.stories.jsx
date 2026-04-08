import { UserIcon } from '@/components/icons'
import Input from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: Input,
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <Input {...args} />,
  args: {
    name: 'name',
    label: 'نام کاربری',
    placeholder: 'برای مثال: amir',
    helperText: 'نام کاربری می‌بایست فقط شامل حروف انگلیسی باشد',
    suffixIcon: <UserIcon className="ml-2" />,
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Error = {
  render: (args) => <Input {...args} />,
  args: {
    name: 'name',
    label: 'نام کاربری',
    placeholder: 'برای مثال: amir',
    suffixIcon: <UserIcon className="ml-2" />,
    error: 'نام کاربری اشتباه می‌باشد',
    helperText: 'نام کاربری می‌بایست فقط شامل حروف انگلیسی باشد',
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Suffix = {
  render: (args) => <Input {...args} />,
  args: {
    name: 'name',
    label: 'مساحت',
    suffix: 'متر مربع',
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Success = {
  render: (args) => <Input {...args} />,
  args: {
    type: 'password',
    value: '12345',
    success: 'رمز عبور صحیح می‌باشد',
    name: 'name',
    label: 'رمز عبور',
  },
}

/** @type {import('@storybook/react').StoryObj} */
export const Horizontal = {
  render: (args) => <Input {...args} />,
  args: {
    name: 'city',
    label: 'شهر',
    horizontalMode: true,
    placeholder: 'انتخاب',
  },
}
