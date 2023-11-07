"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => router.push(href)
  return (
    <Link
      href={href}
      // onClick={onClick}
      // type="button"
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-normal text-slate-500 hover:bg-slate-300/20 hover:text-slate-600 transition-colors",
        isActive &&
          "bg-slate-200/40 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700"
      )}
    >
      <span className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-slate-700")}
        />
        {label}
      </span>
      <span
        className={cn(
          "ml-auto h-full border-2 border-slate-700 opacity-0 transition-opacity",
          isActive && "opacity-100"
        )}
      />
    </Link>
  )
}

export default SidebarItem
