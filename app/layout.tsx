import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'SMIS Bellene Leather',
  description: 'Sistem Manajemen Informasi Persediaan - Bellene Leather Garut',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}