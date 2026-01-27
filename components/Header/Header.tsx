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

      <GoogleOneTap />
    </header>
  )
}
