import { useState } from 'react'
import LocationPicker from './LocationPicker'

/** @type { import('@storybook/react').Meta } */
export default {
  component: LocationPicker,
  title: 'components/ui/LocationPicker',
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: (args) => {
    const [position, setPosition] = useState(args.defaultPosition)
    return (
      <div>
        <LocationPicker {...args} onChange={setPosition} />

        <div className="bg-gray-100 mt-2 p-4">
          <div className="text-left">
            <span>lat:</span>
            <span className="ml-2">{position[0]}</span>
          </div>
          <div className="text-left">
            <span>lng:</span>
            <span className="ml-2">{position[1]}</span>
          </div>
        </div>
      </div>
    )
  },
  args: {
    defaultPosition: [34.6416, 50.8746],
  },
}
