import { Outlet } from 'react-router-dom'

export default function ErrorLayout() {
  const styles = {
    display: 'flex',
    height: '100vh',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  return (
    <div style={styles}>
      <Outlet />
    </div>
  )
}
