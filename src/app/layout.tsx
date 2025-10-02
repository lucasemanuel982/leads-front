import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GTMProvider from '@/components/GTMProvider'
import { Users, Search } from 'lucide-react'

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
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <Search className="h-6 w-6 text-blue-400" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Sistema de Leads
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </GTMProvider>
      </body>
    </html>
  )
}


