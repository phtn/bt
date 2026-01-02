// import {useAuthCtx} from '@/ctx/auth'
// import {NavbarCtxProvider} from '@/ctx/navbar'
// import useDebounce from '@/hooks/use-debounce'
// import {useMobile} from '@/hooks/use-mobile'
// import {useToggle} from '@/hooks/use-toggle'
// import {Icon, type IconName} from '@/lib/icons'
// import {cn} from '@/lib/utils'
// import {useQuery} from 'convex/react'
// import Link from 'next/link'
// import {usePathname, useRouter} from 'next/navigation'
// import {
//   Activity,
//   memo,
//   useCallback,
//   useMemo,
//   useRef,
//   useState,
//   type ReactNode,
// } from 'react'
// import {api} from '../../../convex/_generated/api'
// import {Button} from '../animate-ui/primitives/buttons/button'
// import {Notifications} from '../kokonutui/notifications'
// import {ProfileDropdown} from '../kokonutui/profile-dropdown'
// import {Input} from './input'
// import {ProAvatar} from './pro-avatar'
// import {SearchResults} from './search-results'

// interface NavProps {
//   children?: ReactNode
//   extra?: ReactNode
// }
// interface EssentialButton {
//   href: string
//   icon: IconName
//   onClick?: () => void
// }

// const Nav = ({children, extra}: NavProps) => {
//   const {user} = useAuthCtx()
//   const router = useRouter()
//   const isMobile = useMobile()
//   const pathname = usePathname()

//   // Memoize route computation to prevent recalculation
//   const route = useMemo(() => pathname.split('/').pop(), [pathname])

//   const {on: open, setOn} = useToggle()
//   const {on: onSearch, toggle: toggleSearch} = useToggle()
//   const [searchFocus, setSearchFocus] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')

//   const debouncedQuery = useDebounce(searchQuery, 300)

//   // Memoize search query parameters
//   const searchQueryParams = useMemo(
//     () => ({query: debouncedQuery}),
//     [debouncedQuery],
//   )

//   const searchResults = useQuery(api.userProfiles.q.search, searchQueryParams)

//   const searchInputRef = useRef<HTMLInputElement>(null)

//   // Memoize user profile query parameters
//   const userProfileQueryParams = useMemo(
//     () => ({proId: user?.uid ?? ''}),
//     [user?.uid],
//   )

//   const userProfile = useQuery(
//     api.userProfiles.q.getByProId,
//     userProfileQueryParams,
//   )

//   // Memoize unread message count query parameters
//   const unreadMessageQueryParams = useMemo(
//     () => (user?.uid ? {userProId: user.uid} : 'skip'),
//     [user?.uid],
//   )

//   const unreadMessageCount = useQuery(
//     api.messages.q.getUnreadCount,
//     unreadMessageQueryParams,
//   )

//   // Memoize all event handlers
//   const handleSearchClick = useCallback(() => {
//     toggleSearch()
//     if (!onSearch) {
//       // Use requestAnimationFrame to ensure the DOM update (unhiding the input)
//       // has happened before trying to focus
//       requestAnimationFrame(() => {
//         searchInputRef.current?.focus()
//       })
//     }
//   }, [toggleSearch, onSearch])

//   const onSearchFocus = useCallback(() => {
//     setSearchFocus(true)
//     if (onSearch) {
//       if (searchInputRef.current) {
//         // Short delay to ensure visibility transition has started
//         setTimeout(() => searchInputRef.current?.focus(), 50)
//       }
//     }
//   }, [onSearch])

//   const onSearchBlur = useCallback(() => {
//     // Small delay to allow click events to propagate if needed
//     // though onMouseDown prevention usually handles this
//     toggleSearch()
//     setSearchFocus(false)
//     setSearchQuery('')
//   }, [toggleSearch])

//   const prefetch = useCallback(
//     (username?: string) => {
//       if (username) {
//         router.prefetch(`/u/${username}`)
//       }
//     },
//     [router],
//   )

//   const handleResultSelect = useCallback(
//     (username: string) => {
//       if (username.trim()) {
//         router.push(`/u/${username}`)
//         toggleSearch()
//         setSearchFocus(false)
//         setSearchQuery('')
//       }
//     },
//     [router, toggleSearch],
//   )

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value)
//     },
//     [],
//   )

//   const handleChatClick = useCallback(() => {
//     router.push('/account/chat')
//   }, [router])

//   const handleBackClick = useCallback(() => {
//     router.back()
//   }, [router])

//   // Removed essentialButtons since notifications are handled separately

//   return (
//     <nav
//       className={cn(
//         'max-w-6xl mx-auto flex items-center h-16 lg:h-8 lg:mb-4 px-2 sm:px-6 lg:px-2',
//       )}>
//       {user && (
//         <div className={cn('flex items-center justify-between w-full', {})}>
//           <div
//             className={cn('flex flex-1 items-center w-full opacity-80', {
//               hidden: route === 'profile',
//             })}>
//             <Activity mode={onSearch && isMobile ? 'hidden' : 'visible'}>
//               <Icon
//                 name='chevron-left'
//                 className='size-6 md:size-6'
//                 onClick={handleBackClick}
//               />
//             </Activity>
//             {route === 'chat' && (
//               <span className='hidden ml-2 text-xl lg:text-2xl font-space font-semibold tracking-tighter'>
//                 Chats
//               </span>
//             )}
//           </div>

//           <Activity mode={onSearch && isMobile ? 'hidden' : 'visible'}>
//             <div
//               className={cn('flex items-center space-x-5', {
//                 'space-x-1': userProfile?.cardId,
//                 hidden: route !== 'profile',
//               })}>
//               <Link href='/alpha'>
//                 <Icon name='protap' className='lg:flex w-24' />
//               </Link>
//               {children}
//             </div>
//           </Activity>
//           <Activity mode={onSearch ? 'visible' : 'hidden'}>
//             <div
//               className={cn(
//                 'relative w-full max-w-md mx-auto transition-transform duration-300 ease',
//                 {
//                   'md:-translate-x-1/3 sm:-translate-x-2 -translate-x-1 mx-1':
//                     onSearch,
//                 },
//               )}>
//               <Input
//                 id='search-users'
//                 ref={searchInputRef}
//                 placeholder='Search for people...'
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 autoComplete='off'
//                 className={cn(
//                   'border-0 dark:bg-greyed/40 h-10 w-full rounded-xl',
//                   'placeholder:opacity-90 placeholder:text-base font-space',
//                   'focus-visible:border-0 dark:focus-visible:ring-primary-hover focus-visible:ring-protap-blue focus-visible:ring-1',
//                   'px-4 transition-all duration-200',
//                 )}
//                 onBlur={onSearchBlur}
//                 onFocus={onSearchFocus}
//               />
//               {debouncedQuery.length > 0 && (
//                 <SearchResults
//                   results={searchResults}
//                   onSelect={handleResultSelect}
//                   isLoading={searchResults === undefined}
//                   onHover={prefetch}
//                 />
//               )}
//             </div>
//           </Activity>
//           <div
//             className={cn(
//               'relative h-12 flex items-center justify-between md:space-x-10 space-x-6 transition-transform duration-200',
//               {'space-x-4': onSearch, 'space-x-2': searchFocus},
//             )}>
//             <Activity mode={onSearch ? 'hidden' : 'visible'}>{extra}</Activity>
//             <Activity mode={onSearch ? 'hidden' : 'visible'}>
//               <button
//                 type='button'
//                 id='search-users-btn'
//                 onClick={handleSearchClick}
//                 className='flex items-end rounded-full outline-0 cursor-pointer relative hover:scale-105 transition-transform'>
//                 <Icon
//                   name='user-search'
//                   className='md:size-7 size-6 shrink-0 stroke-width-[1px] opacity-70'
//                 />
//               </button>
//             </Activity>

//             <button
//               id='chat-button'
//               type='button'
//               onClick={handleChatClick}
//               className='flex items-end rounded-full outline-0 cursor-pointer relative hover:scale-105 transition-transform'>
//               <Icon
//                 name={route === 'chat' ? 'chat-alt-fill' : 'chat-alt'}
//                 className={cn(
//                   'md:size-7 size-6 shrink-0 stroke-width-[1px] opacity-80',
//                   {'dark:text-orange-200 opacity-100': route === 'chat'},
//                 )}
//               />
//               {typeof unreadMessageCount === 'number' &&
//                 unreadMessageCount > 0 && (
//                   <span className='absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full border-[1.5px] border-background bg-primary-hover font-space font-medium text-white text-xs dark:shadow-sm'>
//                     {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
//                   </span>
//                 )}
//             </button>
//             <Notifications open={open} onOpenChange={setOn}>
//               <Icon
//                 name='bell'
//                 className='md:size-7 size-6 shrink-0 opacity-80'
//               />
//             </Notifications>
//             <ProfileDropdown>
//               <ProAvatar
//                 photoURL={user.photoURL}
//                 isActivated={!!userProfile?.cardId}
//                 className='hover:border-primary border-[1.5px]'
//                 tiny
//               />
//             </ProfileDropdown>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }

// const EssentialButtons = memo(({buttons}: {buttons: EssentialButton[]}) => (
//   <div className='flex items-center md:space-x-8 space-x-5'>
//     {buttons.map((button, i) => {
//       return (
//         <Link key={i} href={button.href}>
//           <Button
//             id={`button-${i}`}
//             className='rounded-full size-8 aspect-square'
//             onClick={button.onClick}>
//             <Icon name={button.icon} className='md:size-7 size-6 shrink-0' />
//           </Button>
//         </Link>
//       )
//     })}
//   </div>
// ))

// EssentialButtons.displayName = 'EssentialButtons'

// export const UserNavbar = memo(({children}: NavProps) => {
//   return (
//     <NavbarCtxProvider>
//       <Nav>{children}</Nav>
//     </NavbarCtxProvider>
//   )
// })

// UserNavbar.displayName = 'UserNavbar'
