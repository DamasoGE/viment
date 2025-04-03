import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

const RootLayout = () => {
  return (

    <div>
        <Navbar />
          <Outlet />
        <Footer />
    </div>
  )
}

export default RootLayout