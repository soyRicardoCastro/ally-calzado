// import Logo from "./logo"
import SidebarRoutes from "./sidebar-routes"

const Sidebar = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto border-r bg-white shadow-sm">
      <div className="p-6">
        Ally Calzados
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar
