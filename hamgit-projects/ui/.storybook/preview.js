import '@/assets/styles/global.scss'
import Toaster from '@/components/ui/Toaster'

const withToaster = (Story, context) => {
  return (
    <>
      <Story />
      <Toaster />
    </>
  )
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [withToaster],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
