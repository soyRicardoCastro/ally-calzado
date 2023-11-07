"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "./ui/button"

const NavbarRoutes = () => {
  const pathname = usePathname()

  const isChefPage = pathname?.startsWith("/chef")
  const isPlayerPage = pathname?.includes("/capitulo")

  return (
    <div className="ml-auto flex gap-x-2">
      {isChefPage || isPlayerPage ? (
        <Button size="sm" asChild variant="ghost">
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="ghost">
          <Link href="/chef/cursos">Modo Chef</Link>
        </Button>
      )}
    </div>
  )
}

export default NavbarRoutes
