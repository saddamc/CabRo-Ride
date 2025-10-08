import { Outlet } from 'react-router-dom'
import './App.css'
import CommonLayout from './components/layout/CommonLayout'
import { Toaster } from './components/ui/toaster'
// import { adminSidebarItems } from './routes/adminSidebarItems'
// import generateRoutes from './utils/generateRoutes'


function App() {

  // console.log(generateRoutes(adminSidebarItems))


  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
      <Toaster />
    </>
  )
}

export default App
