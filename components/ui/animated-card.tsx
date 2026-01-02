import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export const AnimatedCard = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      role='region'
      aria-labelledby='card-title'
      aria-describedby='card-description'
      className={cn(
        'group/animated-card relative w-[356px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-black',
        className
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role='group'
      className={cn('flex flex-col space-y-1.5 border-t border-zinc-200 p-4 dark:border-zinc-900', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg leading-none font-semibold tracking-tight text-black dark:text-white', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)} {...props} />
}

export function CardVisual({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-[180px] w-[356px] overflow-hidden', className)} {...props} />
}
