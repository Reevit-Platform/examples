import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { CartProvider } from '@/lib/cart'
import { Header } from '@/components/Header'
import { Toaster } from '@/components/Toaster'
import { ThemeProvider } from '@/components/theme-provider'
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Reevit API - Next.js Demo',
  description: 'Premium furniture store demo with direct Reevit API integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
