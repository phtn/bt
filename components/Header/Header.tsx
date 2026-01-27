'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GoogleOneTap } from './GoogleOnetap'

export function Header() {
  const pathname = usePathname()

  const navLinks2 = [
    { href: '/', label: 'Concerts' },
    { href: '#', label: 'Festivals' },
    { href: '#', label: 'Sports' }
  ]

  return (
    <header className='flex items-center justify-between whitespace-nowrap px-6 py-3'>
      <Link href='/' className='flex items-center gap-3'>
        <Image src='/png/wordmark.png' alt='BigTicket Logo' width={100} height={32} className='h-12 w-auto' />
      </Link>
      <nav className='hidden lg:flex items-center gap-8'>
        {navLinks2.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold leading-normal ${
              pathname === link.href ? 'text-primary dark:text-primary' : ''
            }`}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div id='' className='flex items-center gap-4 max-h-10'>
        <button
          className='hidden sm:flex text-slate-900 dark:text-white hover:bg-white/5 size-10 items-center justify-center rounded-full transition-colors'
          aria-label='Search'></button>
        <Link
          href={
            process.env.NODE_ENV === 'production' ? 'https://project.bigticket.ph' : 'http://localhost:3000/project'
          }
          className='flex min-w-21 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 transition-all text-white text-sm font-bold leading-normal tracking-wide disabled:opacity-50'>
          <span className='truncate flex items-center gap-2'>Connect</span>
        </Link>
      </div>
      <GoogleOneTap />
    </header>
  )
}
