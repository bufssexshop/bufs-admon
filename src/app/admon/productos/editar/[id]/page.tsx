'use client'

import {ChangeEvent, useState } from 'react'
import { useSnackbar } from 'notistack'
import draftToHtml from 'draftjs-to-html'
import { useForm } from 'react-hook-form'
import { useSession } from "next-auth/react"
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import { joiResolver } from '@hookform/resolvers/joi'
import { editProductSchema } from '@/helpers/formSchemas'
import EditProductForm from '@/components/EditProduct'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { CircularProgress, Input } from '@nextui-org/react'

type TProduct = {
  _id: string;
  codigo: string;
  nombre: string;
  precio: number;
  precioCredito: number;
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

const schema = editProductSchema.messages({
  'any.required': 'Este campo es requerido',
  'string.empty': 'Este campo es requerido'
})

type TResponseData = string

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

  const { data, isLoading } = productQuery

  const productDetails = data?.detalles || '';
  const blocksFromHTML = convertFromHTML(productDetails)
  const content = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
  )
  // const [editorState, setEditorState] = useState(EditorState.createWithContent(content));

  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [image, setImage] = useState<File | null>(null)
  const [category, setCategory] = useState<string>(data?.categoria || 'none')
  const [secondImage, setSecondImage] = useState<File | null>(null)
  const [previewImageOne, setPreviewImageOne] = useState<string>(data?.image || '')
  const [previewImageTwo, setPreviewImageTwo] = useState<string>(data?.image2 || '')
  const [secondCategory,setSecondCategory] = useState<string>(data?.categoriaDos || 'none')

  const handleChangeSwitch = (value: boolean): any => setValue('disponible', value)

  const editProductMutation = useMutation({
    mutationFn: (data: FormValues) => editProductRequest(data),
    onSuccess: () => {
      enqueueSnackbar('¡Producto actualizado!', {
        variant: 'success',
      })
    }
  })

  const submit = (formValues: FormValues) => editProductMutation.mutate(formValues)
  const onSubmit = () => handleSubmit(submit);


  const onEditorStateChange = (editorState: EditorState) =>  {
    setEditorState(editorState);

    const contentState = convertToRaw(editorState.getCurrentContent());
    const detallesValue = JSON.stringify(contentState);
    setValue('detalles', detallesValue);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files && e.target.files[0];

    if (file)
      if (key === 'image') {
        setImage(file);
        readFile(file, 'image')
      } else {
        setSecondImage(file)
        readFile(file, 'image2')
      }
  };

  const readFile = (file: File, field: string) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        field === 'image' ? setPreviewImageOne(result) : setPreviewImageTwo(result);
      }
    };

    reader.onerror = (e) => console.log(reader.error);

    reader.readAsDataURL(file);
  };

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  )

  const details = draftToHtml(convertToRaw(editorState.getCurrentContent()));

  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, defaultValues }
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: 'onChange',
    defaultValues: {
      codigo: data?.codigo || '',
      nombre: data?.nombre || '',
      precio: data?.precio.toString() || '0',
      precioCredito: data?.precioCredito.toString() ||'',
      detalles: data?.detalles,
      categoria: data?.categoria,
      subcategoria: data?.subcategoria,
      disponible: data?.disponible,
      categoriaDos: data?.categoriaDos,
      subcategoriaDos: data?.subcategoriaDos,
    },
  })

  const deleteImage = (key: string) => {
    let input: HTMLInputElement | null;
    if (key === 'image') {
      setImage(null);
      setPreviewImageOne('');
      input = document.getElementById('fileInput_1') as HTMLInputElement;
    } else {
      setSecondImage(null);
      setPreviewImageTwo('')
      input = document.getElementById('fileInput_2') as HTMLInputElement;
    }

    if (input) {
      input.value = '';
    }
  }

  type TKeys = 'categoria' | 'subcategoria' | 'categoriaDos' | 'subcategoriaDos';
  const handleSelectionChange = (e: { target: { value: string } }, key: TKeys) => {
    if (key === 'categoria') setCategory(e.target.value)
    if (key === 'categoriaDos') setSecondCategory(e.target.value)
    setValue(key, e.target.value)
  }

  const editProductRequest = async (formData: FormValues) => {
    const {
      codigo, nombre, precio, promocion,
      valorPromocion, categoria, subcategoria, precioCredito,
      disponible, categoriaDos, subcategoriaDos,
    } = formData;

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
      `${process.env.NEXT_PUBLIC_API_URL}/productos//updateProductWithOutPicture`,
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
    loading: false,
    defaultValues,
    formValues: data,
  }

  const clearForm = () => {
    reset()
    deleteImage('image')
    deleteImage('image2')
  }

  return (
    (!!data && !isLoading) ? (
      <EditProductForm
        setters={setters}
        getters={getters}
        register={register}
        onSubmit={onSubmit}
        onEditorChange={onEditorStateChange}
        handleChangeSwitch={handleChangeSwitch}
        handleChangeSelector={handleSelectionChange}
        handleChangeInputImage={handleFileChange}
        reset={clearForm}
        errors={errors}
      />
    ) : (
      <CircularProgress label="Cargando..." />
    )
  )
}

export default EditProduct