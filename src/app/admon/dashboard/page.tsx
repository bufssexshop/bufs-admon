'use client'

import { useSession } from "next-auth/react"
import { useQuery } from '@tanstack/react-query'
import {Button, Card, CardFooter, CircularProgress} from "@nextui-org/react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import {Image} from "@nextui-org/react";
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type TCardProps = {
  src: string
  label: string
  num: number
  class?: string
}

const CustomCard = (props: TCardProps) => (
  <Card
    isFooterBlurred
    radius="lg"
    className={`border-none ${props.class} max-w-[250px]`}
  >
    <Image
      isZoomed
      alt="Woman listing to music"
      className="object-cover min-h-[170px] max-h-[170px]"
      height={170}
      src={props.src}
      width={250}
    />
    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
      <p className="text-tiny text-white/80">{props.label}</p>
      <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
        {props.num || 0}
      </Button>
    </CardFooter>
  </Card>
)

type TResponseData = {
  cantidad: number
  inactivos: number
  promociones: number
  usuarios: number
  mensajes: number
  pedidos: number
}

const Dashboard = () => {
  const { data: session } = useSession()

  const getIndicators = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/getIndicators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const data = await response.json()
    return data as TResponseData
  }

  const { data: indicators, isLoading } = useQuery({
    queryKey: ['indicators', session?.user?.token],
    queryFn: () => getIndicators(),
    enabled: !!session?.user?.token,
  })

  const chartData = {
    labels: ['Productos', 'Inactivos', 'Promociones', 'Usuarios'],
    datasets: [
      {
        label: 'Cantidad',
        data: [indicators?.cantidad, indicators?.inactivos, indicators?.promociones, indicators?.usuarios],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 128, 0, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 128, 0, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <main>
      <section className="w-full bg-slate-800 flex justify-center items-start p-10">
        <article className="lg:w-full h-3/4 flex justify-around">
          <div className="flex flex-col gap-10 w-[300px]">
            <CustomCard
              label="Total productos"
              num={indicators?.cantidad || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276432/images/pexels-alexander-krivitskiy-7261388_yycr78.jpg"
            />
            <CustomCard
              class="self-end"
              label="P. Inactivos"
              num={indicators?.inactivos || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276432/images/pexels-alexander-krivitskiy-11117008_a07pig.jpg"
            />
            <CustomCard
              label="Promociones"
              num={indicators?.promociones || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276432/images/pexels-alexander-krivitskiy-5990364_fucaie.jpg"
            />
          </div>
          <div className="w-[500px]">
            {!isLoading ? (
              <Pie data={chartData} />
            ) : (
              <CircularProgress size="lg" aria-label="Loading..."/>
            )}
          </div>
          <div className="flex flex-col gap-10 w-[300px]">
            <CustomCard
              class="self-end"
              label="Usuarios"
              num={indicators?.usuarios || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276432/images/pexels-alexander-krivitskiy-11104885_dqecgi.jpg"
            />
            <CustomCard
              label="Mensajes"
              num={indicators?.mensajes || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276432/images/pexels-alexander-krivitskiy-11124629_mjcm4u.jpg"
            />
            <CustomCard
              class="self-end"
              label="Pedidos"
              num={indicators?.pedidos || 0}
              src="https://res.cloudinary.com/dsykiysl8/image/upload/v1700276440/images/pexels-%D0%BC%D0%B8%D1%85%D0%B0%D0%B8%D0%BB-%D1%88%D0%BD%D0%B5%D0%B9%D0%B4%D0%B5%D1%80-10598203_zvcm18.jpg"
            />
          </div>
        </article>
      </section>
    </main>
    )
}

export default Dashboard
