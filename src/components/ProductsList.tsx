'use client'

import React, { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react"
import { useQuery } from '@tanstack/react-query'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button} from "@nextui-org/react";

type TProduct = {
  _id: string;
  codigo: string;
  nombre: string;
  precio: number;
  precioCredito: number;
  promocion: boolean;
  valorPromocion: number;
  detalles: string;
  categoria: string;
  subcategoria: string;
  disponible: boolean;
  image: string;
  image2: string;
  createdAt: string;
  updatedAt: string;
  pictureId: string;
  pictureId2: string;
  categoriaDos: string;
  subcategoriaDos: string;
  __v: number;
};

type TResponse = {
  products: TProduct[]
  totalProducts: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
} | undefined

const ProductsList = () => {
  const { data: session } = useSession()
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [productsInfo, setProductsInfo] = useState<TResponse>();


  const searchProducts = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/all?page=${page}&limit=${rowsPerPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const res = await response.json()
    return res as TResponse
  }

  const getProductsQuery = useQuery({
    queryKey: ['allProducts', page, rowsPerPage],
    queryFn: searchProducts
  })

  useEffect(() => {
    const { data } = getProductsQuery;
    if (data) {
      setProductsInfo(data as TResponse);
    }
  }, [getProductsQuery]);

  const onRowsPerPageChange = React.useCallback((e: { target: { value: any; }; }) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {productsInfo?.totalProducts || 0} productos</span>
          <label className="flex items-center text-default-400 text-small">
            Resultados por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>

              <option value="35">35</option>
              <option value="40">40</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [onRowsPerPageChange, productsInfo]);

  const bottomContent = useMemo(() => {
    return (
      <div className="dark flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={productsInfo?.totalPages || 0}
          onChange={setPage}
        />
      </div>
    )
  }, [productsInfo?.totalPages, page])

  return (
    <Table
      aria-label="Tabla de productos"
      classNames={{
        base: 'dark',
        table: "dark",
        tbody: 'dark text-white',
        tr: 'hover:bg-default',
        td: 'first:rounded-l-lg last:rounded-r-lg'
      }}
      topContent={topContent}
      bottomContent={bottomContent}
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
        {(productsInfo?.products || []).map((row: TProduct) => (
          <TableRow key={row._id}>
            <TableCell>{row.codigo}</TableCell>
            <TableCell>{row.nombre}</TableCell>
            <TableCell>{row.precio}</TableCell>
            <TableCell>{row.promocion ? 'Sí' : 'No'}</TableCell>
            <TableCell>{row.categoria}</TableCell>
            <TableCell>{row.subcategoria}</TableCell>
            <TableCell>{row.disponible ? 'Sí' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductsList
