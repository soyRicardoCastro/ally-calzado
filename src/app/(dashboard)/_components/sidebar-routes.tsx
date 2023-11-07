'use client'

import { BarChart, Layout, List, ListChecks, DollarSign } from "lucide-react"

import SidebarItem from "./sidebar-item"

const asesorRoutes = [
  {
    icon: Layout,
    label: "Inventario",
    href: "/inventario",
  },
  {
    icon: DollarSign,
    label: "Vender",
    href: "/vender",
  },
]

const encargadoRoutes = [
  ...asesorRoutes,
  {
    icon: List,
    label: "Crear",
    href: "/admin/inventario/crear",
  }
]

const adminRoutes = [
  ...encargadoRoutes,
  {
    icon: ListChecks,
    label: "Usuarios",
    href: "/admin/usuarios",
  },
  {
    icon: BarChart,
    label: 'Analiticas',
    href: '/admin/analiticas',
  },
]

const SidebaRoutes = () => {
  return (
    <div className="flex w-full flex-col">
      {adminRoutes.map((route) => (
        <SidebarItem
          key={route.label}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}

export default SidebaRoutes
