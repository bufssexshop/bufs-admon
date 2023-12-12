'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { categories, subcategories } from '@/helpers/constants'
import { Button, Input, Select, SelectItem, Switch } from "@nextui-org/react"
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false })

type TItems = { name: string, value: string }

const ProductForm = (props: any) => {

  const [doubleCategory, setDoubleCategory] = useState<boolean>(false)

  return (
    <article className="bg-slate-900 dark p-10 rounded-md lg:w-2/4">
      <form onSubmit={props.handleSubmit(props.onSubmit)} className="flex flex-col gap-10 relative">
        <p className="text-white font-bold text-xl pb-10 text-center">Crear Producto</p>
        <section className="absolute right-0 top-0 flex flex-col gap-2">
          <Switch
            size="sm"
            color="success"
            defaultSelected
            aria-label="Disponible"
            onValueChange={props.handleChangeSwitch}
            {...props.register('disponible')}
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
            errorMessage={props?.errors?.codigo?.message}
            {...props.register('codigo')}
          />
          <Input
            type="text"
            label="Nombre"
            errorMessage={props?.errors?.nombre?.message}
            {...props.register('nombre')}
          />
        </section>

        <section className=" flex gap-10">
          <Input
            type="text"
            label="Precio"
            errorMessage={props?.errors?.precio?.message}
            {...props.register('precio')}
          />
          <Input
            type="text"
            label="Precio a crédito"
            {...props.register('precioCredito')}
          />
        </section>

        {/* FIRST CATEGORY */}
        <section className="flex gap-10">
          <Select
            label="Seleccione la categoría"
            className="max-w-md"
            onChange={(e) => props.handleChangeSelector(e, 'categoria')}
            fullWidth
            errorMessage={props?.errors?.categoria?.message}
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
            onChange={(e) => props.handleChangeSelector(e, 'subcategoria')}
            errorMessage={props?.errors?.subcategoria?.message}
          >
            {props.getters.category === 'none' ? (
              <SelectItem key='none' value='none'>
                Elegir...
              </SelectItem>
            ) : subcategories[props.getters.category].map(({ name, value }: TItems) => (
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
              onChange={(e) => props.handleChangeSelector(e, 'categoriaDos')}
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
              onChange={(e) => props.handleChangeSelector(e, 'subcategoriaDos')}
            >
              {props.getters.secondCategory === 'none' ? (
                <SelectItem key='none' value='none'>
                  Elegir...
                </SelectItem>
              ) : subcategories[props.getters.secondCategory].map(({ name, value }: TItems) => (
                <SelectItem key={name} value={value}>
                  {name}
                </SelectItem>
              ))}
            </Select>
          </section>
        )}

        <section className=" flex gap-10">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => props.handleChangeInputImage(e, 'image')}
            className='w-full rounded-medium py-4 px-3 text-tiny bg-default-100 text-default-600'
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => props.handleChangeInputImage(e, 'image2')}
            className='w-full rounded-medium py-4 px-3 text-tiny bg-default-100 text-default-600'
          />
        </section>

        <section>
          <Editor
            editorState={props.getters.editorState}
            editorClassName="bg-slate-800 text-white rounded-sm"
            onEditorStateChange={props.onEditorChange}
          />
        </section>

        <section className="flex justify-end gap-10">
          <Button type='reset' variant="bordered" color="default">Descartar</Button>
          <Button type='submit' color="primary">Guardar</Button>
        </section>
      </form>
    </article>
  )
}

export default ProductForm
