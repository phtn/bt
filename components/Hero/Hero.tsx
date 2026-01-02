'use client'

import { useState, useTransition } from 'react'

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSearch = () => {
    startTransition(() => {
      // Search functionality will be implemented here
      console.log('Searching for:', searchQuery)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='@container'>
      <div className='p-0'>
        <div
          className='relative flex min-h-140 flex-col gap-8 overflow-hidden rounded-3xl items-center justify-center p-8 md:p-16 text-center'
          style={{
            backgroundImage: `linear-gradient(rgba(15, 5, 20, 0.4) 0%, oklch(0.1946 0.014 285.02 / 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8cvSZGflmtC3hq1fCHFz9OPHXc_oJuydoie6AJWnPDQwDo6PNoPOvYAd4Dnfb4Ycn1505LPYyZjFxnFA3OtdPuPt87_5mqe0o8HE7XhAHMY3Sn60RvlBKrufQ0FUMGhsc6pYPjndSx_VBCA8uRtTws7cLZ3ecLGprDW5RhyLFB_EIViaSO7Jw96bzd9nb_1po5hOPjxXOB3GtNmjEUmynkoUugH1oOqG7_M-0ZVpMebGgcgq3ph0DpwM7kvalOKgxI-FWLS3s0gxe')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          <div className='flex flex-col gap-4 max-w-2xl relative z-10'>
            <span className='inline-block mx-auto px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider'>
              Live Events 2024
            </span>
            <h1 className='text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-xl'>
              Experience the
              <span className='text-transparent bg-clip-text bg-linear-to-r from-[#ee2bee] to-white'> Night Live</span>
            </h1>
            <h2 className='text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto'>
              Discover and book the best live events, concerts, and parties happening around you.
            </h2>
          </div>
          <label className='flex flex-col w-full max-w-160 h-16 md:h-20 mt-6 relative z-10 shadow-2xl shadow-primary/20'>
            <div className='flex w-full flex-1 items-stretch rounded-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 p-2 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className='flex w-full min-w-0 flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 px-4 text-base md:text-lg font-medium'
                placeholder='Search by artist, event, or venue...'
              />
              <button
                onClick={handleSearch}
                disabled={isPending}
                className='flex min-w-25 md:min-w-35 cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-background text-sm md:text-base font-bold transition-all disabled:opacity-50'>
                Search
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
