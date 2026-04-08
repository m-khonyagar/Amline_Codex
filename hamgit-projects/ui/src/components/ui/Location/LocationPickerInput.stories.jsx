import LocationPickerInput from './LocationPickerInput'

/** @type { import('@storybook/react').Meta } */
export default {
  component: LocationPickerInput,
  title: 'components/ui/LocationPickerInput',
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => <LocationPickerInput {...args} />,
  args: {
    label: 'موقعیت ملک',
  },
}
