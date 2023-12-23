'use client'

import React from "react"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const NavigationBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Navbar className="dark bg-[#130b29]">
      <NavbarBrand>
        <p className="font-bold text-white text-xl">
          BUFS
          <span className="text-pink-500">
            SEX
          </span>
          SHOP
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link
            underline={pathname === '/admon/dashboard' ? 'always' : 'none'}
            color={pathname === '/admon/dashboard' ? undefined : 'foreground'}
            href="/admon/dashboard"
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            underline={pathname === '/admon/productos' ? 'always' : 'none'}
            color={pathname === '/admon/productos' ? undefined : 'foreground'}
            href="/admon/productos/buscar"
          >
            Productos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            underline={pathname === '/admon/usuarios' ? 'always' : 'none'}
            color={pathname === '/admon/usuarios' ? undefined : 'foreground'}
            href="/admon/usuarios"
          >
            Usuarios
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Pedidos
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })} color="primary" href="#" variant="flat">
            Cerrar sesion
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default NavigationBar
