import { Tabs } from '@base-ui/react/tabs'
import { MeldContent } from '../meld-test/content'
import { PayGateContent } from '../paygate-test/content'

export const ProjectTabs = () => {
  return (
    <Tabs.Root className='rounded-md border border-zinc-600' defaultValue='overview'>
      <Tabs.List className='relative z-0 flex gap-1 px-1 shadow-[inset_0_-1px] shadow-zinc-600'>
        <Tabs.Tab
          className='flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-zinc-400 hover:text-zinc-300 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-zinc-900'
          value='overview'>
          overview
        </Tabs.Tab>
        <Tabs.Tab
          className='flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-zinc-400 hover:text-zinc-300 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-zinc-900'
          value='gate'>
          paygate
        </Tabs.Tab>
        <Tabs.Tab
          className='flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-zinc-400 hover:text-zinc-300 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-zinc-900'
          value='meld'>
          meld
        </Tabs.Tab>
        <Tabs.Tab
          className='flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-zinc-400 hover:text-zinc-300 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-zinc-900'
          value='swapped'>
          swapped
        </Tabs.Tab>
        <Tabs.Tab
          className='flex h-8 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-zinc-400 hover:text-zinc-300 outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 before:outline-blue-800 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-zinc-900'
          value='moonpay'>
          moonpay
        </Tabs.Tab>
        <Tabs.Indicator className='absolute top-1/2 left-0 z-[-1] h-6 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-sm bg-zinc-100 transition-all duration-200 ease-in-out' />
      </Tabs.List>
      <Tabs.Panel
        className='relative flex h-32 items-center justify-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline-2'
        value='overview'>
        <OverviewIcon className='size-10 text-zinc-300' />
      </Tabs.Panel>
      <Tabs.Panel
        className='relative flex h-fit items-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline-2'
        value='gate'>
        <PayGateContent />
      </Tabs.Panel>
      <Tabs.Panel
        className='relative flex h-fit items-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline-2'
        value='meld'>
        <MeldContent />
      </Tabs.Panel>
      <Tabs.Panel
        className='relative flex p-6 h-fit items-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline-2'
        value='swapped'>
        <a href='https://and-cash.vercel.app' target='_blank' rel='noopener noreferrer'>
          swapped api tester &rarr;
        </a>
      </Tabs.Panel>
      <Tabs.Panel
        className='relative flex p-6 h-fit items-center -outline-offset-1 outline-blue-800 focus-visible:rounded-md focus-visible:outline-2'
        value='moonpay'>
        Setting up...
      </Tabs.Panel>
    </Tabs.Root>
  )
}

function OverviewIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width='40' height='40' viewBox='0 0 30 30' fill='currentcolor' {...props}>
      <path d='M 6 4 C 4.895 4 4 4.895 4 6 L 4 12 C 4 13.105 4.895 14 6 14 L 12 14 C 13.105 14 14 13.105 14 12 L 14 6 C 14 4.895 13.105 4 12 4 L 6 4 z M 18 4 C 16.895 4 16 4.895 16 6 L 16 12 C 16 13.105 16.895 14 18 14 L 24 14 C 25.105 14 26 13.105 26 12 L 26 6 C 26 4.895 25.105 4 24 4 L 18 4 z M 9 6 C 10.657 6 12 7.343 12 9 C 12 10.657 10.657 12 9 12 C 7.343 12 6 10.657 6 9 C 6 7.343 7.343 6 9 6 z M 18 6 L 24 6 L 24 12 L 18 12 L 18 6 z M 6 16 C 4.895 16 4 16.895 4 18 L 4 24 C 4 25.105 4.895 26 6 26 L 12 26 C 13.105 26 14 25.105 14 24 L 14 18 C 14 16.895 13.105 16 12 16 L 6 16 z M 18 16 C 16.895 16 16 16.895 16 18 L 16 24 C 16 25.105 16.895 26 18 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 18 C 26 16.895 25.105 16 24 16 L 18 16 z M 21 17.5 L 24.5 21 L 21 24.5 L 17.5 21 L 21 17.5 z M 9 18 L 11.886719 23 L 6.1132812 23 L 9 18 z' />
    </svg>
  )
}
