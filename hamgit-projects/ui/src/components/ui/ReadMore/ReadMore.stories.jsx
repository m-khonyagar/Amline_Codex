import ReadMode from './index'

/** @type { import('@storybook/react').Meta } */
export default {
  component: ReadMode,
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <ReadMode {...args} />,
  args: {
    min: 50,
    max: 80,
    ideal: 60,
    text: 'انسجام / بلوار امین و ساحلی / بلوار سمیه / بنیاد / جمهوری اسلامی / دورشهر / رسالت / زنبیل آباد / سالاریه / شهرک قدس / صفاشهر / صفاییه / عطاران / عماریاسر / معلم / هنرستان / یزدانشهر / فردوسی / باجک',
  },
}
