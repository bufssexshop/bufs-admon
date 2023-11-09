'use client'

import Navbar from "@/components/Navbar"
import { useSession } from "next-auth/react";

type TProps = {
  children: React.ReactNode;
}

const Dashboard = ({ children }: TProps) => {
  const { data: session, status } = useSession();
  console.log('xxx session: ', session);
  console.log('xxx status: ', status);

  return (
    <main className="h-screen">
      <Navbar />
      <section className="w-full h-full bg-slate-800">
        {children}
      </section>
    </main>
    )
}

export default Dashboard
