'use client'

import { useTransition } from 'react'

export function Header() {
  const [isPending, startTransition] = useTransition()

  const handleConnectClick = () => {
    startTransition(() => {
      // Wallet connect functionality will be implemented here
    })
  }

  return (
    <header className='flex items-center justify-between whitespace-nowrap px-6 py-3'>
      <div className='flex items-center gap-3 text-white'>
        <div className='size-8 flex items-center justify-center rounded-full text-primary'>
          <span className='material-symbols-outlined filled' style={{ fontVariationSettings: "'FILL' 1" }}>
            confirmation_number
          </span>
        </div>
        <h2 className='text-slate-900 dark:text-white text-xl font-extrabold leading-tight tracking-tight'>
          BigTicket
        </h2>
      </div>
      <nav className='hidden lg:flex items-center gap-8'>
        <a
          className='text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold leading-normal'
          href='#'>
          Concerts
        </a>
        <a
          className='text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold leading-normal'
          href='#'>
          Festivals
        </a>
        <a
          className='text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold leading-normal'
          href='#'>
          Sports
        </a>
        <a
          className='text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-bold leading-normal'
          href='#'>
          Theater
        </a>
      </nav>
      <div className='flex items-center gap-4'>
        <button
          className='hidden sm:flex text-slate-900 dark:text-white hover:bg-white/5 size-10 items-center justify-center rounded-full transition-colors'
          aria-label='Search'>
          S
        </button>
        <button
          onClick={handleConnectClick}
          disabled={isPending}
          className='flex min-w-21 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 transition-all text-white text-sm font-bold leading-normal tracking-wide disabled:opacity-50'>
          <span className='truncate flex items-center gap-2'>Connect</span>
        </button>
      </div>
    </header>
  )
}
