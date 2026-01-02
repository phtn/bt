import { cn } from '@/lib/utils'
import { ClassName } from '@/types'
import * as React from 'react'

interface Visual1Props {
  mainColor?: string
  secondaryColor?: string
  gridColor?: string
}

export function Visual1({ mainColor = '#8b5cf6', secondaryColor = '#fbbf24', gridColor = '#80808015' }: Visual1Props) {
  return (
    <div aria-hidden className='relative h-full w-full overflow-hidden rounded-t-lg'>
      <Layer4 />
      <GridLayer color={gridColor} />
    </div>
  )
}

interface GridLayerProps {
  color?: string
  className?: ClassName
}

export const GridLayer = ({ className, color = '#80808015' }: GridLayerProps) => {
  return (
    <div
      style={
        {
          '--grid-color': color
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 z-4 h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] bg-size:[20px_20px] bg-center opacity-70',
        className
      )}
    />
  )
}

// interface EllipseGradientProps {
//   color: string
// }

// const EllipseGradient = ({color}: EllipseGradientProps) => {
//   return (
//     <div className='absolute inset-0 z-[5] flex h-full w-full items-center justify-center'>
//       <svg
//         width='356'
//         height='196'
//         viewBox='0 0 356 180'
//         fill='none'
//         xmlns='http://www.w3.org/2000/svg'>
//         <rect width='356' height='180' fill='url(#paint)' />
//         <defs>
//           <radialGradient
//             id='paint'
//             cx='0'
//             cy='0'
//             r='1'
//             gradientUnits='userSpaceOnUse'
//             gradientTransform='translate(178 98) rotate(90) scale(98 178)'>
//             <stop stopColor={color} stopOpacity='0.25' />
//             <stop offset='0.34' stopColor={color} stopOpacity='0.15' />
//             <stop offset='1' stopOpacity='0' />
//           </radialGradient>
//         </defs>
//       </svg>
//     </div>
//   )
// }

const Layer4 = () => {
  return (
    <div className='group relative h-full w-[356px]'>
      <div className='ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-7 flex max-w-[356px] -translate-y-full items-start justify-start bg-transparent p-4 transition-transform duration-500 group-hover/animated-card:translate-y-0'>
        <div className='ease-[cubic-bezier(0.6, 0.6, 0, 1)] rounded-md border border-zinc-200 bg-white/25 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover/animated-card:opacity-100 dark:border-zinc-800 dark:bg-black/25'>
          <p className='mb-1 text-xs font-semibold text-black dark:text-white'>Random Data Visualization</p>
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>Displaying some interesting stats.</p>
        </div>
      </div>
    </div>
  )
}
