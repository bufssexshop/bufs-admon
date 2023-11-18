import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientProviders from '@/providers/client-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bufssexshop | administrar',
  description: 'Gestor de contenido de bufssexshop y admon general',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
