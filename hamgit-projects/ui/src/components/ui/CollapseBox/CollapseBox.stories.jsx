import CollapseBox from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: CollapseBox,
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */

export function Default(args) {
  return (
    <CollapseBox {...args}>
      <p>قسط فلان </p>
    </CollapseBox>
  )
}
Default.args = {
  label: 'قسط دوم - 3,000,000 تومان نقد',
  defaultOpen: true,
}
