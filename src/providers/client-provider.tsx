'use client'

import { SnackbarProvider } from 'notistack'
import Providers from './reactQueryProvider'
import { NextUIProvider } from '@nextui-org/react'

type TProps = {
  children: React.ReactNode;
}

const ClientProviders = ({ children }: TProps) => {
  console.log('ClientProviders')

  return (
    <NextUIProvider>
      <SnackbarProvider maxSnack={3}>
        <Providers>
          {children}
        </Providers>
      </SnackbarProvider>
    </NextUIProvider>
  )
}

export default ClientProviders