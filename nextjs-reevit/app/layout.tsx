import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/Toaster'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Reevit Store - Next.js Demo',
  description: 'Premium furniture store demo with Reevit payments integration',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
