import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/header'
// this is the website for a google task desktop app  built with react & rust (tauri)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Google Tasks',
  description: 'Google Tasks Desktop App for Windows, Mac & Linux',
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
