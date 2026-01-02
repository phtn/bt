import {Icon, IconName} from '@/lib/icons'
import {cn} from '@/lib/utils'
import Link from 'next/link'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className,
      )}>
      {children}
    </div>
  )
}

interface BentoGridItemProps {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  activeIcon?: IconName
  icon: IconName
  pro?: boolean
  href?: string
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  href,
  activeIcon,
  icon,
  pro,
}: BentoGridItemProps) => {
  return (
    <Link
      href={href ?? ''}
      className={cn(
        'group/bento shadow-origin/60 row-span-1 flex flex-col justify-between space-y-4 md:rounded-xl md:border border-b-2 border-neutral-200 bg-white/0 md:p-4 p-8 transition duration-200 hover:shadow-xl md:dark:border-white/10 dark:bg-black dark:shadow-none',
        className,
      )}>
      {header}
      <div className='flex justify-between'>
        <div className='transition duration-300 w-full ease-in-out group-hover/bento:translate-x-2'>
          <div className='flex items-center w-full space-x-2 text-xl md:text-2xl tracking-tighter leading-5 font-sans font-bold text-neutral-600 dark:text-neutral-200'>
            <span>{title}</span>
            <span className='mb-2'>{pro && <ExtraValue value='pro' />}</span>
            {/*<div className='border border-teal-500/0 bg-orange-100 px-1.5 rounded-full text-sm font-figtree dark:text-teal-400 text-foreground font-normal tracking-tight'>
              Activation Required
            </div>*/}
          </div>
          <div className='font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300'>
            {description}
          </div>
        </div>
        {activeIcon && (
          <div className='flex items-center justify-center overflow-hidden size-8'>
            <Icon
              name={activeIcon}
              className={cn(
                'size-6 rotate-45 text-blue-500 md:translate-y-24 md:-translate-x-24',
                'group-hover/bento:translate-y-0 group-hover/bento:translate-x-0',
                'transition duration-300 ease-in-out',
              )}
            />
          </div>
        )}
      </div>
    </Link>
  )
}

interface ExtraValueProps {
  value: string
  label?: string
}
const ExtraValue = ({label, value}: ExtraValueProps) => {
  return (
    <div className='shrink-0 ml-auto'>
      {value && (
        <span
          className={cn(
            'text-xs font-semibold font-figtree uppercase rounded-md py-1 px-2 tracking-tight',
            label !== 'Model'
              ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 border border-indigo-500/10'
              : 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/10',
          )}>
          {value}
        </span>
      )}
    </div>
  )
}
