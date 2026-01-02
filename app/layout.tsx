import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Big Ticket',
  description: 'Excitement guaranteed!',
  icons: [{ rel: 'icon', url: '/icon/tab.svg' }]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <head></head>
      <body
        className={`font-polysans bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
