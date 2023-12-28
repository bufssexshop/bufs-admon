'use client'

import React, { ChangeEvent, ChangeEventHandler, useState } from 'react'
import dynamic from 'next/dynamic'
import noImage from '../../public/noImageAvailable.png'
import { categories, subcategories } from '@/helpers/constants'
import { Avatar, Button, Input, Select, SelectItem, Selection, Switch } from "@nextui-org/react"
import { TrashIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { EditorState } from 'draft-js'
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false })

type TItems = { name: string, value: string }

type TProps = {
  onEditorChange: (editorState: EditorState) => void,
  setters: {
    setAvailable: (isSelected: boolean) => void,
    setCode: React.Dispatch<React.SetStateAction<string>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPrice: React.Dispatch<React.SetStateAction<number>>,
    setCreditPrice: React.Dispatch<React.SetStateAction<number>>,
    handleCategorySelectionChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void,
    handleSubcategorySelectionChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setSecondImage: React.Dispatch<React.SetStateAction<File | null>>,
    deleteImage: (key: string) => void,
  },
  getters: {
    available: boolean,
    code: string,
    name: string,
    price: number,
    creditPrice: number,
    category: string,
    subcategory: string,
    secondCategory: string,
    secondSubcategory: string,
    image: File,
    secondImage: File,
    editorState: EditorState,
    previewImageOne: string,
    previewImageTwo: string,
    loading: boolean,
  },
  defaultValues: {
    disponible: boolean,
    codigo: string,
    nombre: string,
    precio: number,
    precioCredito: number,
    categoria: string,
    subcategoria: string,
    categoriaDos: string,
    subcategoriaDos: string,
    image: string,
    image2: string,
  }
  onSubmit: () => void,
  handleChangeInputImage: (e: ChangeEvent<HTMLInputElement>, key: string) => void
  reset: () => void,
}

const EditProductForm = (props: TProps) => {
  const router = useRouter()
  const { setters, getters, onSubmit, onEditorChange, defaultValues } = props
  const { setCode, setName, setPrice, setCreditPrice, setAvailable } = setters
  const [doubleCategory, setDoubleCategory] = useState<boolean>(getters.secondCategory !== 'none')

  return (
    <article className="bg-slate-900 dark p-10 rounded-md lg:w-2/4">
      <form className="flex flex-col gap-10 relative">
        <p className="text-white font-bold text-xl pb-10 text-center">Editar Producto</p>
        <section className="absolute right-0 top-0 flex flex-col gap-2">
          <Switch
            size="sm"
            color="success"
            aria-label="Disponible"
            isSelected={getters.available}
            onValueChange={setAvailable}
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
            defaultValue={defaultValues.codigo}
            onValueChange={setCode}
          />
          <Input
            type="text"
            label="Nombre"
            defaultValue={defaultValues.nombre}
            onValueChange={setName}
          />
        </section>

        <section className=" flex gap-10">
          <Input
            type="number"
            label="Precio"
            defaultValue={defaultValues.precio.toString()}
            onValueChange={(value: string) => setPrice(value as any)}
          />
          <Input
            type="number"
            label="Precio a crédito"
            defaultValue={defaultValues.precioCredito.toString()}
            onValueChange={(value: string) => setCreditPrice(value as any)}
          />
        </section>

        {/* FIRST CATEGORY */}
        <section className="flex gap-10">
          <Select
            fullWidth
            className="max-w-md"
            selectionMode="single"
            label="Seleccione la categoría"
            disabledKeys={[getters.category]}
            onChange={(e) => setters.handleCategorySelectionChange(e, 'category')}
            selectedKeys={[getters.category]}
          >
            {categories.map(({ name, value }: TItems) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </Select>

          <Select
            fullWidth
            className="max-w-md"
            selectionMode="single"
            label="Seleccione la subcategoría"
            onChange={(e) => setters.handleSubcategorySelectionChange(e, 'subcategory')}
            disabledKeys={[getters.subcategory]}
            selectedKeys={[getters.subcategory]}
          >
            {getters.category === 'none' ? (
              <SelectItem key='none' value='none'>
                Elegir...
              </SelectItem>
            ) : subcategories[getters.category].map(({ name, value }: TItems) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </Select>
        </section>

        {/* DOUBLE CATEGORY */}
        {doubleCategory && (
          <section className=" flex gap-10">
            <Select
              className="max-w-md"
              selectionMode="single"
              label="Seleccione la categoría dos"
              onChange={(e) => setters.handleCategorySelectionChange(e, 'secondCategory')}
              disabledKeys={[getters.secondCategory]}
              selectedKeys={[getters.secondCategory]}
            >
              {categories.map(({ name, value }: TItems) => (
                <SelectItem key={value} value={value}>
                  {name}
                </SelectItem>
              ))}
            </Select>

            <Select
              className="max-w-md"
              selectionMode="single"
              label="Seleccione la subcategoría dos"
              onChange={(e) => setters.handleSubcategorySelectionChange(e, 'secondSubcategory')}
              disabledKeys={[getters?.secondSubcategory]}
              selectedKeys={[getters?.secondSubcategory]}
            >
              {getters.secondCategory === 'none' ? (
                <SelectItem key='none' value='none'>
                  Elegir...
                </SelectItem>
              ) : subcategories[getters?.secondCategory].map(({ name, value }: TItems) => (
                <SelectItem key={value} value={value}>
                  {name}
                </SelectItem>
              ))}
            </Select>
          </section>
        )}

        <section className=" flex gap-10">
          <input
            id="fileInput_1"
            type="file"
            accept="image/*"
            onChange={(e) => props.handleChangeInputImage(e, 'image')}
            className='w-full rounded-medium py-4 px-3 text-tiny bg-default-100 text-default-600'
          />
          <input
            id="fileInput_2"
            type="file"
            accept="image/*"
            onChange={(e) => props.handleChangeInputImage(e, 'image2')}
            className='w-full rounded-medium py-4 px-3 text-tiny bg-default-100 text-default-600'
          />
        </section>

        {(getters.previewImageOne || getters.previewImageTwo) && (
          <section className='flex justify-around'>
            <div className='flex gap-4 items-center'>
              <Avatar
                src={getters.previewImageOne || noImage.src}
                className="w-28 h-28 text-large"
              />
              <Button
                isIconOnly
                color="danger"
                aria-label="eliminar imagen"
                isDisabled={getters.image.size <= 0}
                onClick={() => setters.deleteImage('image')}
              >
                <TrashIcon className="h-6 w-6 text-slate-50" />
              </Button>
            </div>
            <div className='flex gap-4 items-center'>
              <Avatar
                src={getters.previewImageTwo || noImage.src}
                className="w-28 h-28 text-large"
              />
              <Button
                isIconOnly
                color="danger"
                aria-label="eliminar imagen"
                isDisabled={getters.secondImage.size <= 0}
                onClick={() => setters.deleteImage('image2')}
              >
                <TrashIcon className="h-6 w-6 text-slate-50" />
              </Button>
            </div>
          </section>
        )}

        <section>
          <Editor
            editorState={getters.editorState}
            editorClassName="bg-slate-800 text-white rounded-sm"
            onEditorStateChange={(newState) => onEditorChange(newState)}
          />
        </section>

        <section className="flex justify-end gap-10">
          <Button onClick={() => router.push('/admon/productos/buscar')} variant="bordered" color="default">Descartar</Button>
          <Button isLoading={getters.loading} onClick={onSubmit} color="primary">Guardar</Button>
        </section>
      </form>
    </article>
  )
}

export default EditProductForm
