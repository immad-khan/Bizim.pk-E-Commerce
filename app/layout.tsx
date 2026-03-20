import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Crimson_Text } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ProductProvider } from '@/lib/product-context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const _crimsonText = Crimson_Text({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-armand" });

export const metadata: Metadata = {
  title: 'bizim.pk - Premium Bag Collection',
  description: 'Discover our curated collection of premium luxury bags at bizim.pk. Shop limited edition collections with free mystery gifts on every purchase. Cash on delivery available.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_playfairDisplay.variable} ${_crimsonText.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ProductProvider>
            {children}
            <Analytics />
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
