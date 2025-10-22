import { Outlet } from "react-router-dom"
import NewHeader from "../newHeader";

const HomeLayout = () => {

  return (
    <div className="w-full overflow-x-hidden">
        <nav className="w-full fixed top-0 left-0 z-50 ">
          <NewHeader/>
        </nav>
        <div className="h-[50px]"></div>
        <div className="px-4 min-h-[calc(100vh-55px)] mt-1">
        <Outlet />
        </div>
      </div>
  )
}

export default HomeLayout