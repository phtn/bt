'use client'

import { useTransition } from 'react'
import { EventCard, type EventCardProps } from '../EventCard/EventCard'

const trendingEvents: EventCardProps[] = [
  {
    id: '1',
    title: 'Neon Nights Festival',
    location: 'Brooklyn Mirage, NY',
    date: 'Oct 12',
    price: '$85.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLf_Wvq470gOW6GYJUWUyIc5U9xBrrJ1WJ91Y3biyNlcIw6Kdv77jF8f7Gdn3S4lVzrI-Fk3rdlDI1XxdSwqZfVtg7KT0XOBCSq1kfUWXjN5RainiwPl_1gAp0bQ2eF3TdzXBVds9klQkrFioDRtxnpVHrvb0fA7mhmudmtttrX9Btr17xhYqXdxZ5ZBMsX6kyr0xjaqaWkeeW7MpVR7oEITpnI_5FgObySS-ZIWkiFckUleiuxPap_aCOu8yU0IuQQNtNJdQfUDXS',
    imageAlt: 'Exciting rock concert with red lights',
    badge: { text: 'Selling Fast', variant: 'primary' }
  },
  {
    id: '2',
    title: 'Underground Techno',
    location: 'Basement, Berlin',
    date: 'Nov 05',
    price: '$25.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUGYxBY01EGxojG5Z_ItiMjkYwjmqf4kjsDPEWarBm_wZVMRjeg5OgBBf60HYAjLfcZlOmvCiHMU48dkCjogX2xF2hyQG1k_0wzWZ3XFZsIGORgb-5fSl7VEwUjTsG12UI2yZXbSfqt-6LOPHEIyWEW-WirjrCXfqjFHW-AAP0fLNa9Kj4OpK4589Cxwhvjn-2cYbr0yRpHQn6Uy-y5Zr3sWq7MHRhenmkODHfSRYQHdCoE5dyX0o0k_ontk00_500B48OBLG-db4s',
    imageAlt: 'Techno DJ performing in a dark club'
  },
  {
    id: '3',
    title: 'NYE Countdown Gala',
    location: 'The Shard, London',
    date: 'Dec 31',
    price: '$150.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhK39AQbmgXNX4eDePqFhXbLHVELTSAy9i8mQI8vyKFxFsd_ekroi_gcxnYWWwx4qEY7XQ14Ec0RRAmsRxx7ZTZ8433MOKanlPUPIV7RADrnlFeoG66Tq078jTeRbZzVppD2iSNta-U67GpimZgn0o4bdjeaT_vK8RrL0Nvgy9ReXamDfaH7uAHgx94JLffJzr_nikOdtqXAmr9MtwcM575KrfQHaPnoB5SE5rKBrgVggI_NWq8Y560l6gD_ZLNJ_SiyREYk3Q2Cdx',
    imageAlt: 'New years eve fireworks and celebration crowd',
    badge: { text: 'VIP Available', variant: 'purple' }
  },
  {
    id: '4',
    title: 'Acoustic Sessions',
    location: 'Blue Note, Tokyo',
    date: 'Sep 28',
    price: '$45.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLkUClkCyThSu_wPZBvSzPEkoc1lapRxiqtlHkPyzQkZ5mR7ceauJirjS_hSQkBCj2xMEwJ698UX1m9akgFOUs8_YiHKsHtmzsVvu9wtczBCAl9NTv-mp82ijpHyyJ2rIJa7fKd0fq7fvIkbIwvcV2EWmlYzzglRyem4TgOV37Y4hK1_8zGxslGzGrDYORL3bRFrYE1gg0Ljno4yqWsssaSvEyfIiOQRcOX6dsNEyuigzeOfShMhnMG2zDHK98kPGpgqutAOruo-RO',
    imageAlt: 'Intimate acoustic concert session'
  }
]

export function TrendingEvents() {
  const [isPending, startTransition] = useTransition()

  const handleLoadMore = () => {
    startTransition(() => {
      // Load more events functionality will be implemented here
    })
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {trendingEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
      <div className='flex justify-center mt-10'>
        <button
          onClick={handleLoadMore}
          disabled={isPending}
          className='px-8 py-3 rounded-full border border-slate-300 dark:border-white/20 hover:border-primary text-slate-900 dark:text-white font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-50'>
          Load More Events
          <span className='material-symbols-outlined text-sm'>expand_more</span>
        </button>
      </div>
    </>
  )
}
