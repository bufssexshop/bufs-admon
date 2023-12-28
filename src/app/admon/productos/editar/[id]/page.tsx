'use client'

import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import draftToHtml from 'draftjs-to-html'
import { useSession } from "next-auth/react"
import { useQuery, useMutation } from '@tanstack/react-query'
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import EditProductForm from '@/components/EditProduct'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import 'draft-js/dist/Draft.css'
import { CircularProgress } from '@nextui-org/react'

type TProduct = {
  _id: string
  codigo: string
  nombre: string
  precio: number
  precioCredito: number
  detalles: string
  categoria: string
  subcategoria: string
  disponible: boolean
  image: string
  image2: string
  createdAt: string
  updatedAt: string
  pictureId: string
  pictureId2: string
  categoriaDos: string
  subcategoriaDos: string
}

type TResponseData = string

const initialValues = {
  disponible: false,
  codigo: '',
  nombre: '',
  precio: 0,
  precioCredito: 0,
  categoria: 'none',
  subcategoria: 'none',
  categoriaDos: 'none',
  subcategoriaDos: 'none',
  image: '',
  image2: '',
}

const EditProduct = ({ params }: { params: { id: string }}) => {
  const { id: productId } = params

  const getProductData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/getProduct/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const res = await response.json()
    return res as TProduct
  }

  const productQuery =  useQuery({
    queryKey: ['product', productId],
    queryFn: getProductData,
  })

  const { data, isLoading, isFetched } = productQuery

  const productDetails = data?.detalles || ''
  const contentState = ContentState.createFromBlockArray(
    convertFromHTML(productDetails).contentBlocks
  )

  const initialEditorState = EditorState.createWithContent(contentState);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(productDetails);
    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(content));
  }, [productDetails]);

  const getEditorContentAsHTML = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    return draftToHtml(rawContentState);
  };

  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [code, setCode] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState<File>(new File([], ''))
  const [secondImage, setSecondImage] = useState<File>(new File([], ''))
  const [creditPrice, setCreditPrice] = useState<number>(0)
  const [category, setCategory] = useState<string>('none')
  const [subcategory, setSubcategory] = useState<string>('')
  const [secondSubcategory, setSecondSubcategory] = useState<string>('')
  const [secondCategory,setSecondCategory] = useState<string>('')
  const [previewImageOne, setPreviewImageOne] = useState<string>('')
  const [previewImageTwo, setPreviewImageTwo] = useState<string>('')
  const [available, setAvailable] = useState<boolean>(true)

  const [formValid, setFormValid] = useState<boolean>(false)

  const validateForm = () => {
    return !!(code && name && price
      && category && subcategory && secondCategory && secondSubcategory
      && details && (previewImageOne || previewImageTwo))
  }

  const details = getEditorContentAsHTML();

  useEffect(() => {
    if(!isLoading && isFetched && data) {
      setFormValid(validateForm());
    }
  }, [isLoading, isFetched, data, code, name, price,
     category, subcategory, secondCategory, secondSubcategory,
     details, previewImageOne, previewImageTwo])

  const setAllstatesFormData = (product: TProduct) => {
    setAvailable(product.disponible)
    setCode(product.codigo)
    setName(product.nombre)
    setPrice(product.precio)
    setCreditPrice(product.precioCredito)
    setCategory(product.categoria)
    setSubcategory(product.subcategoria)
    setSecondCategory(product.categoriaDos)
    setSecondSubcategory(product.subcategoriaDos)
    setPreviewImageOne(product.image)
    setPreviewImageTwo(product.image2)
  }

  useEffect(() => {
    if (data) setAllstatesFormData(data)
  }, [data])

  const deleteImage = (key: string) => {
    let input: HTMLInputElement | null
    if (key === 'image') {
      setImage(new File([], ''))
      setPreviewImageOne(data?.image || '')
      input = document.getElementById('fileInput_1') as HTMLInputElement
    } else {
      setSecondImage(new File([], ''))
      setPreviewImageTwo(data?.image2 || '')
      input = document.getElementById('fileInput_2') as HTMLInputElement
    }

    if (input) {
      input.value = ''
    }
  }

  const handleCategorySelectionChange = (e: React.ChangeEvent<HTMLSelectElement>, key: string) => {
    if (key === 'category') setCategory(e.target.value)
    else setSecondCategory(e.target.value)
  };

  const handleSubcategorySelectionChange = (e: React.ChangeEvent<HTMLSelectElement>, key: string) => {
    if (key === 'subcategory') setSubcategory(e.target.value)
    else setSecondSubcategory(e.target.value)
  };

  const setters: any = {
    setAvailable,
    setCode,
    setName,
    setPrice,
    setCreditPrice,
    handleCategorySelectionChange,
    handleSubcategorySelectionChange,
    setImage: setImage as React.Dispatch<React.SetStateAction<File | null>>,
    setSecondImage,
    deleteImage
  }

  const editProductMutation = useMutation({
    mutationFn: () => editProductRequest(),
    onSuccess: () =>
      enqueueSnackbar('¡Producto actualizado!', {
        variant: 'success',
      }),
    onError: (error) =>
      enqueueSnackbar(`Parece que hubo un error: ${error}`, {
        variant: 'error',
      })
  })

  const onSubmit = () => editProductMutation.mutate()

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleFileChange = (e: any, key: string) => {
    const file = e.target.files && e.target.files[0]

    if (file)
      if (key === 'image') {
        setImage(file)
        readFile(file, 'image')
      } else {
        setSecondImage(file)
        readFile(file, 'image2')
      }
  }

  const readFile = (file: File, field: string) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string
        field === 'image' ? setPreviewImageOne(result) : setPreviewImageTwo(result)
      }
    }

    reader.onerror = (e) => console.log(reader.error)

    reader.readAsDataURL(file)
  }

  const editProductRequest = async () => {
    const data = new FormData()
      data.append('_id', productId)
      data.append('codigo', code)
      data.append('nombre', name)
      data.append('precio', price.toString())
      data.append('detalles', details)
      data.append('categoria', category)
      data.append('disponible', available.toString())
      data.append('subcategoria', subcategory)
      data.append('precioCredito', creditPrice.toString())
      data.append('categoriaDos', secondCategory)
      data.append('subcategoriaDos', secondSubcategory)

    if (image && image.size > 0) {
      data.append('image', image, image.name);
    }

    if (secondImage && secondImage.size > 0) {
      data.append('image2', secondImage, secondImage.name);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/updateProduct`,
      {
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const res = await response.json()
    return res as TResponseData

  }

  const clearForm = () => {
    deleteImage('image')
    deleteImage('image2')
  }

  const formValues = {
    available,
    code,
    name,
    price,
    creditPrice,
    category,
    subcategory,
    secondCategory,
    secondSubcategory,
    details,
    image,
    secondImage,
    editorState: editorState || initialEditorState,
    previewImageOne,
    previewImageTwo,
    loading: isLoading,
  }

  return (
    (formValid) ? (
      <EditProductForm
        setters={setters}
        getters={formValues}
        defaultValues={data ?? initialValues}
        onSubmit={onSubmit}
        onEditorChange={onEditorStateChange}
        handleChangeInputImage={handleFileChange}
        reset={clearForm}
      />
    ) : (
      <CircularProgress className='dark text-white' label="Cargando..." />
    )
  )
}

export default EditProduct