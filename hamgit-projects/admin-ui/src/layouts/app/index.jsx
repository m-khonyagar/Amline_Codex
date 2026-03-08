import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../../components/ui/Sidebar'
import AppSidebar from './AppSidebar'

export default function AppLayout() {
  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full flex-grow bg-teal-50 overflow-auto">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}
