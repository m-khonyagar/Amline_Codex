import { useMemo } from 'react'
import { toast } from '../ui/Toaster'
import * as IconsData from './index'

/** @type { import('@storybook/react').Meta } */
export default {}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
/** @type {import('@storybook/react').StoryObj} */
export const Default = {
  render: ({ search, ...args }) => {
    const copyName = (Icon) => {
      navigator.clipboard.writeText(Icon.name)
      toast('Icon name copied to clipboard')
    }

    const FilteredIcons = useMemo(() => {
      let result = Object.values(IconsData)

      if (search) {
        result = result.filter((Icon) => Icon.name.toLowerCase().includes(search.toLowerCase()))
      }

      return result
    }, [search])

    return (
      <div className="flex flex-wrap justify-start gap-x-12 gap-y-6">
        {FilteredIcons.map((Icon) => (
          <button
            key={Icon}
            type="button"
            onClick={() => copyName(Icon)}
            className="border-none flex flex-col p-4 bg-none items-center min-w-40"
          >
            <Icon {...args} />
            <div className="mt-3 text-gray-900 text-sm">
              {Icon.name
                .replace('Icon', '')
                .replace(/([A-Z])/g, ' $1')
                .trim()}
            </div>
            <div className="mt-1 text-gray-300 text-xs">{Icon.name}</div>
          </button>
        ))}
      </div>
    )
  },

  args: {
    size: 24,
    color: '#1E1E1F',
    search: '',
  },
}
