import { Icon, IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { type ClassName } from '@/types'
import { type ReactNode } from 'react'

interface WidgetProps {
  children?: ReactNode
  className?: ClassName
}
export const Widget = ({ className, children }: WidgetProps) => {
  return (
    <div
      className={cn(
        'space-y-8 h-fit p-5 font-figtree font-semibold bg-linear-to-t from-foreground/5 via-foreground/20 to-foreground/5 backdrop-blur-3xl dark:from-zinc-800/50 dark:via-zinc-800/80 dark:to-zinc-900/70 border-[0.33px] border-zinc-300 dark:border-zinc-800/60 rounded-[3rem] shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20',
        className
      )}>
      {children}
    </div>
  )
}

interface WidgetHeaderProps {
  title: string
  description: string
  icon?: IconName
  className?: ClassName
}
export const WidgetHeader = ({ title, icon, className, description }: WidgetHeaderProps) => {
  return (
    <div
      className={cn(
        'font-figtree bg-dark-origin dark:bg-origin -ml-6 w-fit py-1 pl-3 pr-8 rounded-r-full shadow-sm',
        className
      )}>
      <div className='flex items-center'>
        {icon && <Icon name={icon} className='mr-2 size-blue-800 text-primary dark:text-teal-200' />}
        <h2 className='font-medium tracking-tighter text-lg px-3 text-foreground/70'>{title}</h2>
      </div>
      <p className='font-normal text-white opacity-50'>{description}</p>
    </div>
  )
}
