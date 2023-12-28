'use client'

import {ChangeEvent, useState } from 'react'
import { useSnackbar } from 'notistack'
import draftToHtml from 'draftjs-to-html'
import { useForm } from 'react-hook-form'
import { useSession } from "next-auth/react"
import ProductForm from "@/components/ProductForm"
import { useMutation } from '@tanstack/react-query'
import { convertToRaw, EditorState } from 'draft-js'
import { joiResolver } from '@hookform/resolvers/joi'
import { productSchema } from '@/helpers/formSchemas'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

type FormValues = {
  codigo: string
  nombre: string
  precio: string
  detalles: string
  promocion: boolean
  precioCredito: string
  valorPromocion: string
  categoria: string
  subcategoria: string
  categoriaDos: string
  subcategoriaDos: string
  disponible: boolean
}

const schema = productSchema.messages({
  'any.required': 'Este campo es requerido',
  'string.empty': 'Este campo es requerido'
})

type TResponseData = string

const CreateProduct = () => {
  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [image, setImage] = useState<File | null>(null)
  const [category, setCategory] = useState<string>('none')
  const [secondImage, setSecondImage] = useState<File | null>(null)
  const [previewImageOne, setPreviewImageOne] = useState<string>('')
  const [previewImageTwo, setPreviewImageTwo] = useState<string>('')
  const [secondCategory,setSecondCategory] = useState<string>('none')

  const handleChangeSwitch = (value: boolean): any => setValue('disponible', value)
  const onSubmit = (formValues: FormValues) => createProductMutation.mutate(formValues)


  const onEditorStateChange = (editorState: EditorState) =>  {
    setEditorState(editorState)

    const contentState = convertToRaw(editorState.getCurrentContent())
    const detallesValue = JSON.stringify(contentState)
    setValue('detalles', detallesValue)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
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

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  )

  const details = draftToHtml(convertToRaw(editorState.getCurrentContent()))

  const defaultValues = {
    disponible: true,
    promocion: false,
    valorPromocion: '0',
    precioCredito: '0',
    categoriaDos: 'none',
    subcategoriaDos: 'none'
  }

  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: 'onChange',
    defaultValues,
  })

  console.log('xxx subcategoria: ', watch('subcategoria'))

  const deleteImage = (key: string) => {
    let input: HTMLInputElement | null
    if (key === 'image') {
      setImage(null)
      setPreviewImageOne('')
      input = document.getElementById('fileInput_1') as HTMLInputElement
    } else {
      setSecondImage(null)
      setPreviewImageTwo('')
      input = document.getElementById('fileInput_2') as HTMLInputElement
    }

    if (input) {
      input.value = ''
    }
  }

  type TKeys = 'categoria' | 'subcategoria' | 'categoriaDos' | 'subcategoriaDos'
  const handleSelectionChange = (e: { target: { value: string } }, key: TKeys) => {
    console.log('xxx e.target.value: ', e.target.value)

    if (key === 'categoria') setCategory(e.target.value)
    if (key === 'categoriaDos') setSecondCategory(e.target.value)
    setValue(key, e.target.value)
  }

  const createProduct = async (formData: FormValues) => {

    const {
      codigo, nombre, precio, promocion,
      valorPromocion, categoria, subcategoria, precioCredito,
      disponible, categoriaDos, subcategoriaDos,
    } = formData

    const data = new FormData()
    data.append('codigo', codigo)
    data.append('nombre', nombre)
    data.append('precio', precio)
    data.append('detalles', details)
    data.append('categoria', categoria)
    data.append('promocion', promocion.toString())
    data.append('disponible', disponible.toString())
    data.append('valorPromocion', valorPromocion)
    data.append('subcategoria', subcategoria)
    data.append('precioCredito', precioCredito)
    data.append('categoriaDos', categoriaDos)
    data.append('subcategoriaDos', subcategoriaDos)


    if(image) {
      data.append('image', image, image?.name)
    }

    if(secondImage) {
      data.append('image2', secondImage, secondImage?.name)
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/crear`,
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

  const createProductMutation = useMutation({
    mutationFn: (data: FormValues) => createProduct(data),
    onSuccess: () => {
      enqueueSnackbar('Producto creado exitosamente.', {
        variant: 'success',
      })
    }
  })

  const { isPending } = createProductMutation

  const setters = {
    setCategory,
    setSecondCategory,
    setImage,
    setSecondImage,
    deleteImage
  }

  const getters = {
    image,
    category,
    secondImage,
    editorState,
    secondCategory,
    previewImageOne,
    previewImageTwo,
    loading: isPending,
  }

  const clearForm = () => {
    reset()
    deleteImage('image')
    deleteImage('image2')
  }

  return (
    <ProductForm
      setters={setters}
      getters={getters}
      register={register}
      onSubmit={onSubmit}
      handleSubmit={handleSubmit}
      onEditorChange={onEditorStateChange}
      handleChangeSwitch={handleChangeSwitch}
      handleChangeSelector={handleSelectionChange}
      handleChangeInputImage={handleFileChange}
      errors={errors}
    />
  )
}

export default CreateProduct