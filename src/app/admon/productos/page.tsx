'use client'

import { ChangeEvent, useState } from "react"
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, EditorState } from 'draft-js'
import { useSnackbar } from 'notistack'
import { useSession } from "next-auth/react"
import { productSchema } from '@/helpers/formSchemas'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { Tab, Tabs } from "@nextui-org/react"
import { joiResolver } from '@hookform/resolvers/joi'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import ProductForm from "@/components/ProductForm"
import SearchProductsList from "@/components/SearchProductsList";
import ProductsList from "@/components/ProductsList";

type TResponseData = string

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

const Productos = () => {
  const { data: session } = useSession()
  const [image, setImage] = useState<File | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const [previewImageOne, setPreviewImageOne] = useState<string>('')
  const [previewImageTwo, setPreviewImageTwo] = useState<string>('')
  const [secondImage, setSecondImage] = useState<File | null>(null)
  const [secondCategory,setSecondCategory] = useState<string>('none')
  const [category, setCategory] = useState<string>('none')
  const [currentTab, setCurrentTab] = useState<string>('create')

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

  const setters = {
    setCategory,
    setSecondCategory,
    setImage,
    setSecondImage,
    deleteImage,
  }

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  )

  const details = draftToHtml(convertToRaw(editorState.getCurrentContent()));

  const getters = {
    image,
    category,
    secondImage,
    editorState,
    secondCategory,
    previewImageOne,
    previewImageTwo,
  }

  type TKeys = 'categoria' | 'subcategoria' | 'categoriaDos' | 'subcategoriaDos';
  const handleSelectionChange = (e: { target: { value: string } }, key: TKeys) => {
    if (key === 'categoria') setCategory(e.target.value)
    if (key === 'categoriaDos') setSecondCategory(e.target.value)
    setValue(key, e.target.value)
  }

  const defaultValues = {
    disponible: true,
    promocion: false,
    valorPromocion: '0',
    precioCredito: '0',
    categoriaDos: 'none',
    subcategoriaDos: 'none'
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: 'onChange',
    defaultValues,
  })

  const onEditorStateChange = (editorState: EditorState) =>  {
    setEditorState(editorState);

    const contentState = convertToRaw(editorState.getCurrentContent());
    const detallesValue = JSON.stringify(contentState);
    setValue('detalles', detallesValue);
  }

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

  const createProduct = async (formData: FormValues) => {
    console.log('xxx formData: ', formData)

    const {
      codigo, nombre, precio, detalles, promocion,
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


    // if(file) {
    //   data.append('image', file[0], file[0].name)
    // }

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/productos/crear`,
    //   {
    //     method: "POST",
    //     body: data,
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: `Bearer ${session?.user?.token}`,
    //     },
    //   }
    // )

    // const res = await response.json()
    // return res as TResponseData

  }


  const createProductMutation = useMutation({
    mutationFn: (data: FormValues) => createProduct(data),
    onSuccess: () => {
      enqueueSnackbar('Producto creado exitosamente.', {
        variant: 'success',
      })
    }
  })

  const onSubmit = (formValues: FormValues) => createProductMutation.mutate(formValues)
  console.log('xxx errors: ', errors)

  const handleSelectChange = (key: React.Key): any => setCurrentTab(String(key))
  const handleChangeSwitch = (value: boolean): any => setValue('disponible', value);

  return (
    <section className="p-10 w-full min-h-screen flex flex-col items-center gap-10">

      <Tabs
        radius="full"
        color="primary"
        aria-label="Opciones"
        selectedKey={currentTab}
        onSelectionChange={handleSelectChange}
      >
        <Tab key="list" title="Listar"/>
        <Tab key="search" title="Buscar"/>
        <Tab key="create" title="Crear"/>
        <Tab key="edit" title="Editar"/>
      </Tabs>

      {currentTab === 'list' && (
        <ProductsList />
      )}

      {currentTab === 'search' && (
        <SearchProductsList />
      )}

      {currentTab === 'create' && (
        <ProductForm
          setters={setters}
          getters={getters}
          register={register}
          onSubmit={createProduct}
          handleSubmit={handleSubmit}
          onEditorChange={onEditorStateChange}
          handleChangeSwitch={handleChangeSwitch}
          handleChangeSelector={handleSelectionChange}
          handleChangeInputImage={handleFileChange}
          errors={errors}
        />
      )}
    </section>
  )
}

export default Productos
