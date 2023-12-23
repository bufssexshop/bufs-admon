import Component from './page'

type TProps = {
  children: React.ReactNode;
}

export default function DashboardLayout ({ children }: TProps) {
  return (
    <section className="p-10 w-full h-min flex flex-col items-center gap-10">
      <Component />
      {children}
    </section>
  )
}
