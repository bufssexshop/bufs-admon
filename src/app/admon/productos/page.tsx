'use client'

import { useRouter, usePathname } from "next/navigation"

const Productos = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentPath = pathname.split('/')[3];

  const ListItem = ({ label, value }: { label: string, value: string }) => {
    return (
      <li
        onClick={() => router.push(`/admon/productos/${value}`)}
        className={`
          px-2 py-1
          ${currentPath === value
            ? 'bg-blue-500 text-white'
            : 'bg-white text-slate-500'}
          rounded-full
          cursor-pointer
        `}
      >
        {label}
      </li>
    )}

  return (
    <section>
      <ul className="flex gap-5 bg-slate-50 py-3 px-6 rounded-full">
        <ListItem value="total" label="Listar" />
        <ListItem value="buscar" label="Buscar" />
        <ListItem value="crear" label="Crear" />
        <ListItem value="editar" label="Editar" />
      </ul>
    </section>
  )
}

export default Productos
