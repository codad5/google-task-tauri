import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/header'
// this is the website for a google task desktop app  built with react & rust (tauri)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Google Tasks',
  description: 'Google Tasks Desktop App for Windows, Mac & Linux built using React & Rust (Tauri)',
  keywords: ['google', 'task', 'desktop', 'client', 'electron', 'react', 'typescript', 'nextjs', 'codad5', 'windows', 'mac', 'linux', 'tauri', 'lightweight', 'fast', 'cross-platform'],
  authors: [{ name: 'Chibueze Michael Aniezeofor', url: 'https://codad5.me' }],
  creator: 'Chibueze Michael Aniezeofor',
  publisher: 'Chibueze Michael Aniezeofor',
  alternates: {},
  formatDetection: {
      email: true,
      address: true,
      telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'standard',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
