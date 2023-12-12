'use client'

import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react"
import { useMutation } from '@tanstack/react-query'
import {Table, Input, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, Button, Switch} from "@nextui-org/react";

type TData = {
  search: string,
  typeSearch: string,
}

type TResponseData = {
  _id: string;
  codigo: string;
  nombre: string;
  precio: number;
  promocion: boolean;
  valorPromocion: number;
  detalles: string;
  categoria: string;
  subcategoria: string;
  disponible: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  pictureId: string;
  categoriaDos: string;
  subcategoriaDos: string;
};


const ProductsList = () => {
  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [products, setProducts] = useState<TResponseData[]>([]);

  const data: TData = {
    search: 'lubricante',
    typeSearch: 'forName',
  }

  const searchProducts = async (data: TData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/getSearch`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const res = await response.json()
    return res as TResponseData[]
  }

  const searchProductsMutation = useMutation({
    mutationFn: (data: TData) => searchProducts(data),
    onSuccess: (response) => {
      setProducts(response);
      if (response.length > 0)
        enqueueSnackbar('Productos encontrados.', {
          variant: 'success',
        })
      else  enqueueSnackbar('No se encontraron productos.', {
        variant: 'info',
      })
    }
  })

  useEffect(() => {
    searchProductsMutation.mutate(data);
  }, [])

  return (
    <Table
      aria-label="Tabla de productos"
      classNames={{
        base: 'dark',
        table: "dark min-h-[200px]",
        tbody: 'dark text-white'
      }}
    >
      <TableHeader>
        <TableColumn key="code" allowsSorting>
          Código
        </TableColumn>
        <TableColumn key="productName" allowsSorting>
          Nombre
        </TableColumn>
        <TableColumn key="price" allowsSorting>
          Precio
        </TableColumn>
        <TableColumn key="sale" allowsSorting>
          Promo
        </TableColumn>
        <TableColumn key="category" allowsSorting>
          Cat
        </TableColumn>
        <TableColumn key="subcategory" allowsSorting>
          Subcat
        </TableColumn>
        <TableColumn key="active" allowsSorting>
          Activo
        </TableColumn>
      </TableHeader>
      <TableBody>
        {products.map((row) =>
          <TableRow key={row._id}>
            <TableCell>{row.codigo}</TableCell>
            <TableCell>{row.nombre}</TableCell>
            <TableCell>{row.precio}</TableCell>
            <TableCell>{row.promocion ? 'Sí' : 'No'}</TableCell>
            <TableCell>{row.categoria}</TableCell>
            <TableCell>{row.subcategoria}</TableCell>
            <TableCell>{row.disponible ? 'Sí' : 'No'}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ProductsList
