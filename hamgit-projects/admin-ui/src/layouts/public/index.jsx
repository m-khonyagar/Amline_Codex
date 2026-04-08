import { Outlet } from 'react-router-dom'

export default function BaseLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
