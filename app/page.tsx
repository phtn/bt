import { CategoryButtons } from '@/components/CategoryButtons/CategoryButtons'
import { EventHosting } from '@/components/EventHosting/EventHosting'
import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { Hero } from '@/components/Hero/Hero'
import { Layout, LayoutContent } from '@/components/Layout/Layout'
import { TrendingEvents } from '@/components/TrendingEvents/TrendingEvents'

export default function Home() {
  return (
    <Layout>
      <LayoutContent>
        <Header />
      </LayoutContent>
      <LayoutContent>
        <Hero />
      </LayoutContent>
      <LayoutContent className='py-2'>
        <CategoryButtons />
      </LayoutContent>
      <LayoutContent className='py-8'>
        <TrendingEvents />
      </LayoutContent>
      <div className='w-full flex justify-center py-16 px-4 md:px-10'>
        <div className='layout-content-container flex flex-col w-full max-w-250'>
          <EventHosting />
        </div>
      </div>
      <Footer />
    </Layout>
  )
}
