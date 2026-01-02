import { cn } from '@/lib/utils'
import { type ClassName } from '@/types'

interface BeaconProps {
  className?: ClassName
}

export const Beacon = ({ className }: BeaconProps) => {
  return (
    <div className={cn('size-8 flex items-center justify-center relative overflow-hidden rounded-full', className)}>
      <div className='size-2 rounded-full bg-primary-hover x-ping delay-300 absolute blur-[2px]' />
      <div className='size-2 rounded-full bg-sky-50 x-ping delay-200 absolute blur-[1.5px]' />
      <div className='size-3 rounded-full border-[0.1px] border-primary-hover dark:border-teal-300 delay-200 x-ping absolute' />
    </div>
  )
}
