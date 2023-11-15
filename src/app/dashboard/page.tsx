'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from '@tanstack/react-query'
import {CircularProgress} from "@nextui-org/react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  const getIndicators = fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/productos/getIndicators`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.user?.token}`,
      },
    }
  ).then((res) => res.json())

  const { data, isFetching } = useQuery({
    queryKey: ['indicators'],
    queryFn: () => getIndicators,
  })

  const chartData = {
    labels: ['Productos', 'Inactivos', 'Promociones', 'Usuarios'],
    datasets: [
      {
        label: 'Cantidad',
        data: [data?.cantidad, data?.inactivos, data?.promociones, data?.usuarios],
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
  console.log('xxx data: ', data);
  console.log('xxx loading: ', loading);

  return (
    <main>
      <section className="w-full h-screen bg-slate-800 flex justify-center items-start p-10">
        <article className="lg:w-[800px] h-3/4 flex justify-center">
          {!isFetching ? (
            <Pie data={chartData} />
          ) : (
            <CircularProgress size="lg" aria-label="Loading..."/>
          )}
        </article>
      </section>
    </main>
    )
}

export default Dashboard
