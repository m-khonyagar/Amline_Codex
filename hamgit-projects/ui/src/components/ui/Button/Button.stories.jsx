import Button, { buttonVariantsSchema } from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: Button,
  argTypes: {
    variant: {
      options: Object.keys(buttonVariantsSchema.variant),
      control: { type: 'radio' },
    },
    size: {
      options: Object.keys(buttonVariantsSchema.size),
      control: { type: 'radio' },
    },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: ({ children, ...args }) => <Button {...args}>{children}</Button>,
  args: {
    children: 'تایید',
  },
}
