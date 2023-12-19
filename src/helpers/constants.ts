type TCategories = { name: string, value: string }
type TSubcategories = { [key: string]: TCategories[]}

export const categories: TCategories[] = [
  { name: 'Elegir...', value: 'none'},
  { name: 'Juguetes', value: 'juguetes'},
  { name: 'Lubricantes', value: 'lubricantes'},
  { name: 'Lencería', value: 'lenceria'},
  { name: 'Fetiche', value: 'fetiche'},
  { name: 'Higiene y Protección', value: 'higieneyproteccion'},
  { name: 'Accesorios', value: 'accesorios'},
  { name: 'Potenciadores', value: 'potenciadores'},
  { name: 'Más', value: 'mas'},
]


export const subcategories: TSubcategories = {
  juguetes: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Vibradores', value: 'vibradores' },
    { name: 'Masculinos', value: 'masculinos' },
    { name: 'Femeninos', value: 'femeninos' },
    { name: 'Anal', value: 'anal' },
    { name: 'Consoladores', value: 'consoladores' },
    { name: 'Anillos vibradores', value: 'anillos' },
    { name: 'Control remoto', value: 'controlRemoto' },
    { name: 'Interactivos', value: 'interactivos' },
    { name: 'Juegos de mesa', value: 'juegosMesa' },
  ],
  lubricantes: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Estrechantes', value: 'estrechantes' },
    { name: 'Multiorgasmos', value: 'multiorgasmos' },
    { name: 'Masajes', value: 'masajes' },
    { name: 'Retardantes', value: 'retardantes' },
    { name: 'Anales', value: 'anales' },
    { name: 'Con sabor', value: 'conSabor' },
    { name: 'Sin sabor', value: 'sinSabor' },
    { name: 'Sexo oral', value: 'sexoOral' },
    { name: 'A prueba de agua', value: 'aPruebaDeAgua' },
    { name: 'Kits de lubricación', value: 'kitsDeLubricacion' },
    { name: 'Lubricantes especiales', value: 'lubricantesEspeciales' },
  ],
  lenceria: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Disfraces', value: 'disfraces' },
    { name: 'Lencería', value: 'lenceria' },
    { name: 'Fetiche', value: 'fetiche' },
    { name: 'Calzado', value: 'calzado' },
    { name: 'Bodys', value: 'bodys' },
    { name: 'Conjuntos', value: 'conjuntos' },
    { name: 'Babydoll', value: 'babdydoll' },
    { name: 'Medias', value: 'medias' },
    { name: 'Pantys', value: 'pantys' },
    { name: 'Pijamas', value: 'pijamas' },
    { name: 'Enterizos', value: 'enterizos' },
  ],
  fetiche: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Juguetes para pezones', value: 'juguetesPezones' },
    { name: 'Máscaras', value: 'mascaras' },
    { name: 'Mordazas', value: 'mordazas' },
    { name: 'Esposas', value: 'esposas' },
    { name: 'Arnés', value: 'arnes' },
    { name: 'Nalguear', value: 'nalguear' },
    { name: 'Látigos y fustas', value: 'latigosFustas' },
    { name: 'Collares', value: 'collares' },
    { name: 'Columpios', value: 'columpios' },
    { name: 'Antifaz ', value: 'antifaz' },
    { name: 'Velas', value: 'velas' },
    { name: 'Plumas', value: 'plumas' },
    { name: 'Kit fetichista', value: 'kitFetichista' },
  ],
  higieneyproteccion: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Condones', value: 'condones' },
    { name: 'Aseo personal', value: 'aseoPersonal' },
  ],
  mas: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Potenciadores', value: 'potenciadores' },
  ],
  accesorios: [
    { name: 'Elegir...', value: 'none' },
    { name: 'General', value: 'general' },
  ],
  potenciadores: [
    { name: 'Elegir...', value: 'none' },
    { name: 'Masculinos', value: 'masculinos' },
    { name: 'Femeninos', value: 'femeninos' },
  ],
}

export const disponibilidad = [
  { name: 'Si', value: true },
  { name: 'No', value: false },
]