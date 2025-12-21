'use client'

import { useTransition } from 'react'

interface Category {
  id: string
  label: string
  icon: string
  isActive?: boolean
}

const categories: Category[] = [
  { id: 'concerts', label: 'Concerts', icon: 'music_note', isActive: true },
  { id: 'parties', label: 'Parties', icon: 'celebration' },
  { id: 'festivals', label: 'Festivals', icon: 'festival' },
  { id: 'comedy', label: 'Comedy', icon: 'theater_comedy' },
  { id: 'sports', label: 'Sports', icon: 'trophy' },
  { id: 'escapades', label: 'Escapades', icon: 'flight' }
]

export function CategoryButtons() {
  const [isPending, startTransition] = useTransition()

  const handleCategoryClick = (categoryId: string) => {
    startTransition(() => {
      // Category filter functionality will be implemented here
      console.log('Selected category:', categoryId)
    })
  }

  return (
    <>
      <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            disabled={isPending}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-6 transition-all hover:scale-105 active:scale-95 ${
              category.isActive
                ? 'text-primary'
                : 'bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 group'
            } disabled:opacity-50`}>
            <p
              className={`text-sm font-bold ${
                category.isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'
              }`}>
              {category.label}
            </p>
          </button>
        ))}
      </div>
    </>
  )
}
