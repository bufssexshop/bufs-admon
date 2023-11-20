'use client'

import { EditorState } from 'draft-js'
import { useSnackbar } from 'notistack'
import { useSession } from "next-auth/react"
import { Editor } from 'react-draft-wysiwyg'
import { SetStateAction, useState } from "react"
import { productSchema } from '@/helpers/formSchemas'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { categories, subcategories } from '@/helpers/constants'
import { Button, Input, Select, SelectItem, Switch, Tab, Tabs } from "@nextui-org/react"
import { joiResolver } from '@hookform/resolvers/joi'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'


type TItems = { name: string, value: string }
type TResponseData = string

type FormValues = {
  codigo: string
  nombre: string
  precio: number
  detalles: string
  promocion: boolean
  precioCredito: number
  valorPromocion: number
  categoria: string
  subcategoria: string
  categoriaDos?: string
  subcategoriaDos?: string
  disponible: boolean
  image?: File
  image2?: File
}

const schema = productSchema.messages({
  'any.required': 'Este campo es requerido',
  'string.empty': 'Este campo es requerido'
})

const Productos = () => {
  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [category, setCategory] = useState<string>('none');
  const [currentTab, setCurrentTab] = useState<string>('create');
  const [doubleCategory, setDoubleCategory] = useState<boolean>(false);

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onEditorStateChange = (editorState: SetStateAction<EditorState>) =>  setEditorState(editorState);

  const handleSelectionChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCategory(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(schema),
    mode: 'onChange'
  })

  const createProduct = async (formData: FormValues) => {
    console.log('xxx formData: ', formData);

    // const data = new FormData()
    // data.append('codigo', codigo)
    // data.append('nombre', nombre)
    // data.append('precio', precio)
    // data.append('detalles', text)
    // data.append('promocion', false)
    // data.append('valorPromocion', 0)
    // data.append('categoria', categoria)
    // data.append('precioCredito', precio)
    // data.append('disponible', disponible)
    // data.append('categoriaDos', categoriaDos)
    // data.append('subcategoria', subcategoria)
    // data.append('subcategoriaDos', subcategoriaDos)

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
      });
    }
  });

  const onSubmit = (formValues: FormValues) => createProductMutation.mutate(formValues)
  console.log('xxx errors: ', errors);

  return (
    <section className="p-10 w-full flex flex-col items-center gap-10">

      <Tabs
        radius="full"
        color="primary"
        aria-label="Opciones"
        selectedKey={currentTab}
        onSelectionChange={setCurrentTab}
      >
        <Tab key="search" title="Buscar"/>
        <Tab key="create" title="Crear"/>
        <Tab key="edit" title="Editar"/>
      </Tabs>

      {currentTab === 'create' && (
        <article className="bg-slate-900 dark p-10 rounded-md lg:w-2/4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 relative">
            <p className="text-white font-bold text-xl pb-10 text-center">Crear Producto</p>
            <section className="absolute right-0 top-0 flex flex-col gap-2">
              <Switch
                size="sm"
                color="success"
                defaultSelected
                aria-label="Disponible"
                {...register('disponible')}
              >
                Disponible
              </Switch>
              <Switch size="sm" isSelected={doubleCategory} onValueChange={setDoubleCategory} aria-label="Disponible">
                Doble categoria
              </Switch>
            </section>
            <section className=" flex gap-10">
              <Input
                type="text"
                label="Código"
                {...register('codigo')}
              />
              <Input
                type="text"
                label="Nombre"
                {...register('nombre')}
              />
            </section>

            <section className=" flex gap-10">
              <Input
                type="text"
                label="Precio"
                {...register('precio')}
              />
              <Input
                type="text"
                label="Precio a crédito"
                {...register('precioCredito')}
              />
            </section>

            {/* FIRST CATEGORY */}
            <section className="flex gap-10">
              <Select
                label="Seleccione la categoría"
                className="max-w-md"
                onChange={handleSelectionChange}
                fullWidth
              >
                {categories.map(({ name, value }: TItems) => (
                  <SelectItem key={value} value={value}>
                    {name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Seleccione la subcategoría"
                className="max-w-md"
                fullWidth
              >
                {category === 'none' ? (
                  <SelectItem key='none' value='none'>
                    Elegir...
                  </SelectItem>
                ) : subcategories[category].map(({ name, value }: TItems) => (
                  <SelectItem key={name} value={value}>
                    {name}
                  </SelectItem>
                ))}
              </Select>
            </section>

            {/* DOUBLE CATEGORY */}
            {doubleCategory && (
              <section className=" flex gap-10">
                <Select
                  label="Seleccione la categoría dos"
                  className="max-w-md"
                  onChange={handleSelectionChange}
                >
                  {categories.map(({ name, value }: TItems) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Seleccione la subcategoría dos"
                  className="max-w-md"
                >
                  {category === 'none' ? (
                    <SelectItem key='none' value='none'>
                      Elegir...
                    </SelectItem>
                  ) : subcategories[category].map(({ name, value }: TItems) => (
                    <SelectItem key={name} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </Select>
              </section>
            )}

            <section className=" flex gap-10">
              <Input
                type="file"
                {...register('image')}
              />
              <Input
                type="file"
                {...register('image2')}
              />
            </section>

            <section>
              <Editor
                editorState={editorState}
                editorClassName="bg-slate-800 text-white rounded-sm"
                onEditorStateChange={onEditorStateChange}
              />
            </section>

            <section className="flex justify-end gap-10">
              <Button variant="bordered" color="default">Descartar</Button>
              <Button color="primary">Guardar</Button>
            </section>
          </form>
        </article>
      )}
    </section>
  )
}

export default Productos
