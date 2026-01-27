'use client'
import { Icon } from '@/lib/icons'
import { Avatar } from '@base-ui/react/avatar'
import { Popover } from '@base-ui/react/popover'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ComponentType, Fragment, useCallback } from 'react'

const userPopover = Popover.createHandle<ComponentType>()
const authenticatedUserPopover = Popover.createHandle<ComponentType>()

export const PopoverDetachedTriggers = () => {
  return (
    <div className='flex gap-2'>
      <Popover.Trigger
        className={`
          box-border flex
          size-10 items-center justify-center
          rounded-md border border-gray-200
          bg-gray-50
          text-base font-bold text-gray-900
          select-none
          hover:bg-gray-100 focus-visible:outline-2
          focus-visible:-outline-offset-1
          focus-visible:outline-blue-600 active:bg-gray-100 data-popup-open:bg-gray-100`}
        handle={userPopover}
        payload={NotificationsPanel}>
        <Icon name='info' className='size-5' />
      </Popover.Trigger>

      <Popover.Root handle={userPopover}>
        {({ payload: Payload }) => (
          <Popover.Portal>
            <Popover.Positioner
              sideOffset={8}
              className={`
                h-(--positioner-height) w-(--positioner-width)
                max-w-(--available-width)
                transition-[top,left,right,bottom,transform]
                duration-[0.35s]
                ease-[cubic-bezier(0.22,1,0.36,1)]
                data-instant:transition-none`}>
              <Popover.Popup
                className={`
                  relative h-(--popup-height,auto) w-(--popup-width,auto)
                  max-w-[500px] origin-(--transform-origin)
                  rounded-lg bg-[canvas] text-gray-900
                  shadow-lg
                  shadow-gray-200
                  outline-1
                  outline-gray-200
                  transition-[width,height,opacity,scale]
                  duration-[0.35s]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  data-ending-style:scale-90
                  data-ending-style:opacity-0 data-instant:transition-none
                  data-starting-style:scale-90
                  data-starting-style:opacity-0
                  dark:shadow-none
                  dark:-outline-offset-1
                  dark:outline-gray-300`}>
                <Popover.Arrow
                  className={`
                    flex
                    transition-[left] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[side=bottom]:-top-2
                    data-[side=left]:right-[-13px]
                    data-[side=left]:rotate-90
                    data-[side=right]:left-[-13px]
                    data-[side=right]:-rotate-90
                    data-[side=top]:bottom-[-8px]
                    data-[side=top]:rotate-180`}>
                  <ArrowSvg />
                </Popover.Arrow>

                <Popover.Viewport
                  className={`
                    relative h-full w-full overflow-clip p-[1rem_1.5rem]
                    [&_[data-current]]:w-[calc(var(--popup-width)-3rem)]
                    [&_[data-current]]:translate-x-0
                    [&_[data-current]]:opacity-100
                    [&_[data-current]]:transition-[translate,opacity]
                    [&_[data-current]]:duration-[350ms,175ms]
                    [&_[data-current]]:ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
                    data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
                    data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
                    data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
                    [&_[data-previous]]:w-[calc(var(--popup-width)-3rem)]
                    [&_[data-previous]]:translate-x-0
                    [&_[data-previous]]:opacity-100
                    [&_[data-previous]]:transition-[translate,opacity]
                    [&_[data-previous]]:duration-[350ms,175ms]
                    [&_[data-previous]]:ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
                    data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
                    data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
                    data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0`}>
                  {Payload !== undefined && <Payload />}
                </Popover.Viewport>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </Popover.Root>
    </div>
  )
}

interface UserPopoverProps {
  displayName: string | null
  photoUrl: string | null
  signOut: VoidFunction
}

export const UserPopover = ({ displayName, photoUrl, signOut }: UserPopoverProps) => {
  const ProfilePanelWithProps = useCallback(
    () => <ProfilePanel displayName={displayName} photoUrl={photoUrl} signOut={signOut} />,
    [displayName, photoUrl, signOut]
  )

  return (
    <div className='flex items-center gap-2'>
      <Popover.Trigger
        className={`
          box-border flex
          size-8 items-center justify-center
          rounded-full border border-gray-200
          bg-gray-50
          text-base font-bold text-gray-900
          select-none
          hover:bg-gray-100 focus-visible:outline-2
          focus-visible:-outline-offset-1
          focus-visible:outline-blue-600 active:bg-gray-100 data-popup-open:bg-gray-100`}
        handle={authenticatedUserPopover}
        payload={ProfilePanelWithProps}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            width={32}
            height={32}
            alt={displayName || 'User'}
            className='h-full w-full rounded-full object-cover'
            referrerPolicy='no-referrer'
          />
        ) : (
          <Icon name='user' className='size-5' />
        )}
      </Popover.Trigger>

      <Popover.Root handle={authenticatedUserPopover}>
        {({ payload: Payload }) => (
          <Popover.Portal>
            <Popover.Positioner
              sideOffset={8}
              className={`
                h-(--positioner-height) w-(--positioner-width)
                max-w-(--available-width)
                transition-[top,left,right,bottom,transform]
                duration-[0.35s] rounded-lg
                ease-[cubic-bezier(0.22,1,0.36,1)]
                data-instant:transition-none`}>
              <Popover.Popup
                className={`
                  relative h-(--popup-height,auto) w-(--popup-width,auto)
                  max-w-[500px] origin-(--transform-origin)
                  rounded-lg bg-[canvas] text-gray-900
                  shadow-lg
                  shadow-gray-200
                  outline-1
                  outline-gray-200
                  transition-[width,height,opacity,scale]
                  duration-[0.35s]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  data-ending-style:scale-90
                  data-ending-style:opacity-0 data-instant:transition-none
                  data-starting-style:scale-90
                  data-starting-style:opacity-0
                  dark:shadow-none
                  dark:-outline-offset-1
                  dark:outline-gray-300`}>
                <Popover.Arrow
                  className={`
                    flex
                    transition-[left] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[side=bottom]:-top-2.75
                    data-[side=left]:right-[-13px]
                    data-[side=left]:rotate-90
                    data-[side=right]:left-[-13px]
                    data-[side=right]:-rotate-90
                    data-[side=top]:bottom-[-8px]
                    data-[side=top]:rotate-180`}>
                  <ArrowSvg />
                </Popover.Arrow>

                <Popover.Viewport
                  className={`
                    relative h-full w-full overflow-clip p-[1rem_1.5rem]
                    [&_[data-current]]:w-[calc(var(--popup-width)-3rem)]
                    [&_[data-current]]:translate-x-0
                    [&_[data-current]]:opacity-100
                    [&_[data-current]]:transition-[translate,opacity]
                    [&_[data-current]]:duration-[350ms,175ms]
                    [&_[data-current]]:ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
                    data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
                    data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
                    data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
                    [&_[data-previous]]:w-[calc(var(--popup-width)-3rem)]
                    [&_[data-previous]]:translate-x-0
                    [&_[data-previous]]:opacity-100
                    [&_[data-previous]]:transition-[translate,opacity]
                    [&_[data-previous]]:duration-[350ms,175ms]
                    [&_[data-previous]]:ease-[cubic-bezier(0.22,1,0.36,1)]
                    data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
                    data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
                    data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
                    data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0`}>
                  {Payload !== undefined && <Payload />}
                </Popover.Viewport>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </Popover.Root>
    </div>
  )
}

function NotificationsPanel() {
  return (
    <Fragment>
      <Popover.Title className='m-0 text-base font-medium'>Notifications</Popover.Title>
      <Popover.Description className='m-0 text-base text-gray-600'>
        You are all caught up. Good job!
      </Popover.Description>
    </Fragment>
  )
}

interface ProfilePanelProps {
  displayName: string | null
  photoUrl: string | null
  signOut: VoidFunction
}

function ProfilePanel({ displayName, photoUrl, signOut }: ProfilePanelProps) {
  const router = useRouter()
  const navigateToProject = useCallback(() => {
    router.push('/project')
  }, [router])
  const navigateToWebhooks = useCallback(() => {
    router.push('/webhooks-meld')
  }, [router])

  return (
    <div className='-mx-2 grid grid-cols-[auto_auto] gap-x-4'>
      <Popover.Title className='col-start-2 col-end-3 row-start-1 row-end-2 m-0 text-base font-medium'>
        {displayName}
      </Popover.Title>
      <Avatar.Root className='col-start-1 col-end-2 row-start-1 row-end-3 inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 align-middle text-base leading-none font-medium text-gray-900 select-none'>
        <Avatar.Image src={photoUrl ?? undefined} width='48' height='48' className='h-full w-full object-cover' />
      </Avatar.Root>
      <span className='col-start-2 col-end-3 row-start-2 row-end-3 text-sm text-gray-600'>Pro plan</span>
      <div className='col-start-1 col-end-3 row-start-3 row-end-4 mt-2 flex flex-col gap-2 border-t border-gray-200 pt-2 text-sm'>
        <button onClick={navigateToProject} className='text-gray-900'>
          Projects
        </button>
        <button onClick={navigateToWebhooks} className='text-gray-900'>
          Webhooks
        </button>
        <button onClick={signOut} className='text-gray-900'>
          Log out
        </button>
      </div>
    </div>
  )
}

function ActivityPanel() {
  return (
    <Fragment>
      <Popover.Title className='m-0 text-base font-medium'>Activity</Popover.Title>
      <Popover.Description className='m-0 text-base text-gray-600'>
        Nothing interesting happened recently.
      </Popover.Description>
    </Fragment>
  )
}
function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width='20' height='10' viewBox='0 0 20 10' fill='none' {...props}>
      <path
        d='M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z'
        className='fill-[canvas]'
      />
      <path
        d='M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z'
        className='fill-gray-200 dark:fill-none'
      />
      <path
        d='M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z'
        className='dark:fill-gray-300'
      />
    </svg>
  )
}
