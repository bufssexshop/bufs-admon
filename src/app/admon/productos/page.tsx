'use client'

import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { SetStateAction, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { categories, subcategories } from '@/helpers/constants'
import { Button, Input, Select, SelectItem, Switch, Tab, Tabs } from "@nextui-org/react"


type TItems = { name: string, value: string }

const Productos = () => {
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
          <form className="flex flex-col gap-10 relative">
            <p className="text-white font-bold text-xl pb-10 text-center">Crear Producto</p>
            <section className="absolute right-0 top-0 flex flex-col gap-2">
              <Switch size="sm" color="success" defaultSelected aria-label="Disponible">
                Disponible
              </Switch>
              <Switch size="sm" isSelected={doubleCategory} onValueChange={setDoubleCategory} aria-label="Disponible">
                Doble categoria
              </Switch>
            </section>
            <section className=" flex gap-10">
              <Input type="text" label="Código" />
              <Input type="text" label="Nombre" />
            </section>

            <section className=" flex gap-10">
              <Input type="text" label="Precio" />
              <Input type="text" label="Precio a crédito" />
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
              <Input type="file" />
              <Input type="file" />
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
