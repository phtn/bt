'use client'

export function Footer() {
  return (
    <footer className='border-t border-slate-200 dark:border-white/10 bg-surface-light dark:bg-[#1a0c1a] pt-16 pb-8'>
      <div className='layout-content-container max-w-300 mx-auto px-4 md:px-10'>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12'>
          <div className='col-span-2 lg:col-span-2 flex flex-col gap-4'>
            <div className='flex items-center gap-3 text-slate-900 dark:text-white'>
              <div className='size-8 flex items-center justify-center rounded-full bg-primary/20 text-primary'>
                <span className='material-symbols-outlined filled' style={{ fontVariationSettings: "'FILL' 1" }}>
                  confirmation_number
                </span>
              </div>
              <h2 className='text-xl font-extrabold tracking-tight'>LiveTix</h2>
            </div>
            <p className='text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed'>
              The world&apos;s leading platform for live entertainment ticketing. Secure, fast, and always fair.
            </p>
            <div className='flex gap-4 mt-2'>
              <a
                className='size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all'
                href='#'
                aria-label='Website'>
                <span className='material-symbols-outlined text-[20px]'>public</span>
              </a>
              <a
                className='size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all'
                href='#'
                aria-label='Email'>
                <span className='material-symbols-outlined text-[20px]'>alternate_email</span>
              </a>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h4 className='text-slate-900 dark:text-white font-bold'>Discover</h4>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Concerts
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Festivals
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Theater
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Sports
            </a>
          </div>
          <div className='flex flex-col gap-4'>
            <h4 className='text-slate-900 dark:text-white font-bold'>Support</h4>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Help Center
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Terms of Service
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Privacy Policy
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Refunds
            </a>
          </div>
          <div className='flex flex-col gap-4'>
            <h4 className='text-slate-900 dark:text-white font-bold'>Company</h4>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              About Us
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Careers
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Partners
            </a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm' href='#'>
              Contact
            </a>
          </div>
        </div>
        <div className='border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-slate-400 text-sm'>© 2024 LiveTix Inc. All rights reserved.</p>
          <div className='flex items-center gap-6'>
            <span className='text-slate-500 text-sm flex items-center gap-2'>
              <span className='material-symbols-outlined text-sm'>language</span> English (US)
            </span>
            <span className='text-slate-500 text-sm flex items-center gap-2'>
              <span className='material-symbols-outlined text-sm'>attach_money</span> USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
