type TProduct = {
  _id: string
  codigo: string
  nombre: string
  precio: number
  detalles: string
  categoria: string
  disponible: boolean
  subcategoria: string
  precioCredito: number
  categoriaDos: string
  subcategoriaDos: string
  image?: File
  image2?: File
}

type TResponseMessage = { message: string }

export const updateProduct = async (product: TProduct, token: string) => {

  const data = new FormData()
  data.append('_id', product._id)
  data.append('codigo', product.codigo)
  data.append('nombre', product.nombre)
  data.append('precio', product.precio.toString())
  data.append('detalles', product.detalles)
  data.append('categoria', product.categoria)
  data.append('disponible', product.disponible.toString())
  data.append('subcategoria', product.subcategoria)
  data.append('precioCredito', product.precioCredito.toString())
  data.append('categoriaDos', product.categoriaDos)
  data.append('subcategoriaDos', product.subcategoriaDos)

  if (product.image && product.image.size > 0) {
    data.append('image', product.image, product.image.name);
  }

  if (product.image2 && product.image2.size > 0) {
    data.append('image2', product.image2, product.image2.name);
  }

  const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/productos/updateProduct`,
  {
    method: 'POST',
    body: data,
    headers: {
      authorization: `Bearer ${token}`,
    },
   })

   const res = await response.json()
   return res as TResponseMessage
}