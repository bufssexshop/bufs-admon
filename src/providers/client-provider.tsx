'use client'

import { SnackbarProvider } from 'notistack'
import Providers from './reactQueryProvider'
import { NextUIProvider } from '@nextui-org/react'
import SessionAuthProvider from '@/context/SessionAuthProvider'

type TProps = {
  children: React.ReactNode
}

const ClientProviders = ({ children }: TProps) => {
  return (
    <NextUIProvider>
      <SessionAuthProvider>
        <Providers>
          <SnackbarProvider maxSnack={3}>
            {children}
          </SnackbarProvider>
        </Providers>
      </SessionAuthProvider>
    </NextUIProvider>
  )
}

export default ClientProviders