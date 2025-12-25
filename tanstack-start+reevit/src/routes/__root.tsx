import { HeadContent, Scripts, createRootRoute, Outlet } from '@tanstack/react-router'

import { Header } from '../components/Header'
import { Toaster } from '../components/Toaster'
import { CartProvider } from '../lib/cart'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Reevit Store - TanStack Start Demo',
      },
      {
        name: 'description',
        content: 'Premium furniture store demo with Reevit payments integration',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Toaster />
    </CartProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
