import { Outlet } from 'react-router-dom'
import './App.css'
import CommonLayout from './components/layout/CommonLayout'
// import { adminSidebarItems } from './routes/adminSidebarItems'
// import generateRoutes from './utils/generateRoutes'


function App() {

  // console.log(generateRoutes(adminSidebarItems))

  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
      
    </>
  )
}

export default App
