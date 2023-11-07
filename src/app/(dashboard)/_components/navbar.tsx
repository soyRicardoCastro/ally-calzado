import MobileSidebar from "./mobile-sidebar"

const Navbar = () => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
    </div>
  )
}

export default Navbar
