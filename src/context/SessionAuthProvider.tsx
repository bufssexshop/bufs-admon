'use client'
import { SessionProvider } from "next-auth/react"

type TProps = {
  children: React.ReactNode
}


const SessionAuthProvider = ({ children }: TProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default SessionAuthProvider
