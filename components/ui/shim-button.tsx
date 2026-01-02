// import ShimmerText, {
//   ShimmerTextProps,
// } from '@/components/kokonutui/shimmer-text'
// import {cn} from '@/lib/utils'
// import {HTMLMotionProps} from 'motion/react'
// import {ReactNode} from 'react'
// import {SexyButton} from '../experimental/sexy-button-variants'

// interface Props extends HTMLMotionProps<'button'>, ShimmerTextProps {
//   children?: ReactNode
//   surface?: 'light' | 'dark'
// }

// export const ShimmerButton = ({
//   className,
//   children,
//   onClick,
//   surface = 'light',
//   ...props
// }: Props) => {
//   return (
//     <SexyButton
//       {...(props as HTMLMotionProps<'button'>)}
//       onClick={onClick}
//       initial={{opacity: 0, scale: 0.4}}
//       animate={{opacity: 1, scale: 1}}
//       transition={{
//         delay: 1.6,
//         type: 'spring',
//         visualDuration: 0.45,
//         bounce: 0.45,
//       }}
//       whileTap={{scale: 0.9, animationDuration: 0.3}}
//       className={cn(
//         'h-10 flex items-center justify-center md:space-x-1 space-x-0.5 bg-black',
//         'border border-zinc-500/80 dark:border-zinc-700',
//         'ps-3.5 pe-2.5 rounded-full',
//         className,
//       )}>
//       <div className='flex items-center space-x-2 px-3'>
//         <ShimmerText
//           className='h-10 ps-0 md:text-base px-0 leading-10'
//           // text="Activate Protap"
//           // playOnHover
//           surface={surface}
//           variant='default'>
//           {children}
//         </ShimmerText>
//       </div>
//     </SexyButton>
//   )
// }
