// import {Icon} from '@/lib/icons'
// import {cn} from '@/lib/utils'
// import {memo, useCallback} from 'react'
// import {Avatar, AvatarFallback, AvatarImage} from './avatar'
// import {ScrollArea} from './scroll-area'

// interface SearchResultProps {
//   results: any[] | undefined
//   onSelect: (username: string) => void
//   isLoading: boolean
//   onHover: (username?: string) => void
// }

// export const SearchResults = memo(
//   ({results, onSelect, onHover}: SearchResultProps) => {
//     // Memoize profile click handlers to prevent recreation
//     const handleProfileClick = useCallback(
//       (profile: {username?: string; cardId?: string}) => {
//         onSelect(profile.username ?? profile.cardId ?? '')
//       },
//       [onSelect],
//     )

//     return (
//       <div className='absolute top-full left-0 md:w-full w-[calc(85lvw)] mt-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden z-999 animate-in fade-in-0 zoom-in-95 duration-200'>
//         <ScrollArea className='max-h-[300px]'>
//           {results === undefined ? (
//             <div className='p-4 text-center text-sm text-muted-foreground font-medium'>
//               Searching...
//             </div>
//           ) : results.length === 0 ? (
//             <div className='p-4 text-center text-sm text-muted-foreground font-medium'>
//               No people found
//             </div>
//           ) : (
//             <div className='p-1.5 space-y-0.5'>
//               {results.map((profile) => (
//                 <button
//                   key={profile._id}
//                   onMouseEnter={() => onHover(profile.username)}
//                   className='w-full flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-all duration-200 group text-left border-b-[0.33px] border-foreground/2'
//                   onMouseDown={(e) => e.preventDefault()}
//                   onClick={() => handleProfileClick(profile)}>
//                   <Avatar className='h-8 w-8 border border-zinc-200 dark:border-zinc-800'>
//                     <AvatarImage
//                       src={profile.avatarUrl || undefined}
//                       className='object-cover'
//                     />
//                     <AvatarFallback className='bg-zinc-100 dark:bg-zinc-800 text-xs font-medium'>
//                       {profile.displayName?.[0]?.toUpperCase() || 'U'}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className='flex flex-col flex-1 min-w-0'>
//                     <span className='text-sm font-medium tracking-tight text-foreground truncate group-hover:text-primary transition-colors'>
//                       {profile.displayName || 'Unknown'}
//                     </span>
//                     <span
//                       className={cn(
//                         'text-xs text-muted-foreground/80 font-normal truncate opacity-0',
//                         {'opacity-100': profile.username},
//                       )}>
//                       @{profile.username}
//                     </span>
//                   </div>
//                   {profile.companyName && (
//                     <div className='hidden sm:block text-xs text-muted-foreground/60 font-medium truncate max-w-[100px] text-right mr-2'>
//                       {profile.companyName}
//                     </div>
//                   )}
//                   <Icon
//                     name='chevron-right'
//                     className='w-4 h-4 text-muted-foreground/50 group-hover:text-primary/50 transition-colors'
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </div>
//     )
//   },
//   (prevProps, nextProps) => {
//     // Custom comparison for SearchResults
//     if (prevProps.isLoading !== nextProps.isLoading) return false
//     if (prevProps.results === nextProps.results) return true
//     if (prevProps.results === undefined || nextProps.results === undefined) {
//       return false
//     }
//     if (prevProps.results.length !== nextProps.results.length) return false

//     // Deep comparison of results array
//     return prevProps.results.every(
//       (prev, index) =>
//         prev._id === nextProps.results?.[index]?._id &&
//         prev.username === nextProps.results?.[index]?.username &&
//         prev.cardId === nextProps.results?.[index]?.cardId,
//     )
//   },
// )

// SearchResults.displayName = 'SearchResults'
