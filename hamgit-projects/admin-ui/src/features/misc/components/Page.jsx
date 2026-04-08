import { SidebarTrigger } from '@/components/ui/Sidebar'

const Page = ({ title, children }) => {
  return (
    <>
      <title>{title}</title>

      <div className="w-full flex items-center gap-3 border-b p-4 bg-gray-50 fa">
        <SidebarTrigger />

        {title && <h1 className="font-semibold">{title}</h1>}
      </div>

      <div className="py-6 w-full px-4">{children}</div>
    </>
  )
}

export default Page
