import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ReactQueryProvider } from '@/lib/react-query-provider'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import { Toaster } from 'react-hot-toast'
import { ClientI18nProvider } from '@/components/ClientI18nProvider'
import { OfflineBanner } from '@/components/OfflineBanner'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NEST - Homeless People Aid & Management',
  description: 'Humanitarian aid and homeless management system',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="bg-cream dark:bg-dark-bg text-deepbrown dark:text-dark-text font-poppins transition-colors overflow-x-hidden">
        <ReactQueryProvider>
          <ClientI18nProvider>
            <OfflineBanner />
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#3C2F2F',
                  color: '#FEF7F0',
                },
                success: {
                  iconTheme: {
                    primary: '#B08968',
                    secondary: '#FEF7F0',
                  },
                },
              }}
            />
          </ClientI18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
