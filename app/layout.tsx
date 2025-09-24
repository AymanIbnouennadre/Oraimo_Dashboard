import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import { NavigationProvider } from "@/components/navigation-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Oraimo SmartScan Admin Dashboard",
    template: "%s | Oraimo SmartScan"
  },
  description: "Professional administration dashboard for Oraimo SmartScan platform - AI-powered product detection and inventory management system",
  keywords: ["Oraimo", "SmartScan", "AI", "Dashboard", "Inventory", "Product Detection", "Admin"],
  authors: [{ name: "Oraimo Team" }],
  creator: "Oraimo",
  publisher: "Oraimo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://oraimosmartscan-admin.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oraimosmartscan-admin.com',
    title: 'Oraimo SmartScan Admin Dashboard',
    description: 'Professional administration dashboard for Oraimo SmartScan platform - AI-powered product detection and inventory management system',
    siteName: 'Oraimo SmartScan Admin',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Oraimo SmartScan Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oraimo SmartScan Admin Dashboard',
    description: 'Professional administration dashboard for Oraimo SmartScan platform',
    images: ['/android-chrome-512x512.png'],
    creator: '@Oraimo',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <AuthProvider>
          <NavigationProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </NavigationProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
