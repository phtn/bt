import { Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { ClassName } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

interface Props {
  photoURL: string | null
  isActivated?: boolean
  className?: ClassName
  tiny?: boolean
}

export const ProAvatar = ({ photoURL, tiny = false, isActivated = false, className }: Props) => {
  return photoURL ? (
    <Avatar
      className={cn(
        'flex items-center overflow-visible justify-center aspect-auto size-12 shadow-2xs select-none',
        className
      )}>
      <AvatarFallback className='bg-zinc-300'>
        <Icon name='spinner-dots' className='size-6' />
      </AvatarFallback>
      <AvatarImage
        src={photoURL}
        className={cn('aspect-auto overflow-hidden w-auto border-0 border-white/40 dark:border-zinc-900 rounded-full', {
          'h-8 w-auto': tiny
        })}
      />
      <VerifiedBadge isActivated={isActivated} />
    </Avatar>
  ) : (
    <Icon name='user' />
  )
}

const VerifiedBadge = ({ isActivated }: { isActivated: boolean }) => {
  return isActivated ? (
    <div
      className={cn(
        'size-auto md:hidden -right-1 -bottom-1 z-100 pointer-events-none aspect-square flex items-center justify-center absolute'
      )}>
      <div className='absolute bg-white size-3 aspect-square rounded-full' />
      <Icon
        name='check-fill'
        className='size-[22px] text-primary-hover dark:text-primary-hover relative z-2 drop-shadow'
      />
    </div>
  ) : null
}

/*
<div
              className={cn(
                'size-auto md:hidden -right-1.5 -bottom-0.5 z-100 pointer-events-none aspect-square flex items-center justify-center absolute',
                {
                  'hidden ': !user.isActivated,
                },
              )}>
              <div className='absolute bg-white size-3 aspect-square rounded-full' />
              <Icon
                name='badge-verified-solid'
                className='size-[22px] text-primary-hover dark:text-primary-hover relative z-2 drop-shadow'
              />
            </div>
*/
