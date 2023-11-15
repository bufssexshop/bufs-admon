import Navbar from "@/components/Navbar";

type TProps = {
  children: React.ReactNode;
}

export default function DashboardLayout ({ children }: TProps) {
  return (
    <section className=''>
      <Navbar />
      {children}
    </section>
  )
}