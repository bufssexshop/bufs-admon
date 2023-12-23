import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

type TProps = {
  children: React.ReactNode
}

export default function DashboardLayout ({ children }: TProps) {
  return (
    <section className=' bg-slate-800 min-h-screen'>
      <Navbar />
      {children}
      <Footer />
    </section>
  )
}