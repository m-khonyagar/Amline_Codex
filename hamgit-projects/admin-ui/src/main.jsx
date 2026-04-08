// import './polyfills'
import routes from '@/routes'
import '@/assets/styles/index.scss'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={routes} />
  // </React.StrictMode>
)
