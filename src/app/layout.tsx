import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GTMProvider from '@/components/GTMProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cadastro de Leads',
  description: 'Sistema de gerenciamento de leads',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <GTMProvider>
          {children}
        </GTMProvider>
      </body>
    </html>
  )
}


