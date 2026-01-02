'use client'

import Image from 'next/image'

export interface EventCardProps {
  id: string
  title: string
  location: string
  date: string
  price: string
  imageUrl: string
  imageAlt: string
  badge?: {
    text: string
    variant: 'primary' | 'purple'
  }
}

export function EventCard({ title, location, date, imageUrl, imageAlt, badge }: EventCardProps) {
  return (
    <div className='group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_rgba(238,43,238,0.15)]'>
      <div className='relative h-60 w-full overflow-hidden'>
        <div className='absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md rounded-lg px-3 py-1 border border-white/10'>
          <p className='text-white text-xs font-bold uppercase'>{date}</p>
        </div>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-110'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
        />
        <div className='absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/80 to-transparent' />
        {badge && (
          <div className='absolute bottom-3 left-3 right-3 flex justify-between items-end'>
            <span
              className={`${
                badge.variant === 'primary' ? 'bg-primary' : 'bg-indigo-500'
              } text-background text-xs font-bold px-2 py-1 rounded-md`}>
              {badge.text}
            </span>
          </div>
        )}
      </div>
      <div className='p-5 flex flex-col gap-3 flex-1'>
        <div>
          <h3 className='text-slate-900 dark:text-white text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors'>
            {title}
          </h3>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1'>{location}</p>
        </div>
      </div>
    </div>
  )
}
