import InputNumber from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: InputNumber,
  args: {
    type: 'tel',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <InputNumber {...args} />,
  args: {
    name: 'price',
    label: 'قیمت',
    placeholder: '200,000,000',
    helperText: 'نام کاربری می‌بایست فقط شامل حروف انگلیسی باشد',
    suffix: 'تومان',
  },
}

// /** @type {import('@storybook/react').StoryObj} */
// export const Error = {
//   render: (args) => <Input {...args} />,
//   args: {
//     name: 'name',
//     label: 'نام کاربری',
//     placeholder: 'برای مثال: amir',
//     suffixIcon: <UserIcon className="ml-2" />,
//     error: 'نام کاربری اشتباه می‌باشد',
//     helperText: 'نام کاربری می‌بایست فقط شامل حروف انگلیسی باشد',
//   },
// }
