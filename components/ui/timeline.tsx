// 'use client'
// import {Icon} from '@/lib/icons'
// import {cn} from '@/lib/utils'
// import {
//   motion,
//   useMotionValueEvent,
//   useScroll,
//   useTransform,
// } from 'motion/react'
// import React, {Activity, useEffect, useRef, useState} from 'react'

// export interface TimelineEntry {
//   title: string
//   content: React.ReactNode
//   hasActiveTasks?: boolean // Whether this phase has completed/in-progress/started tasks
//   stopProgressAt?: React.RefObject<HTMLElement> // Optional ref to element where progress should stop
// }

// interface TimelineProps {
//   data: TimelineEntry[]
//   title?: string
//   description?: string
//   completion?: number
//   scrollContainerRef?: React.RefObject<HTMLElement | null>
// }

// export const Timeline = ({
//   data,
//   title,
//   description,
//   completion,
//   scrollContainerRef,
// }: TimelineProps) => {
//   const ref = useRef<HTMLDivElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const phaseRefs = useRef<(HTMLDivElement | null)[]>([])
//   const [height, setHeight] = useState(0)
//   const [maxProgressHeight, setMaxProgressHeight] = useState(0)
//   const [activePhases, setActivePhases] = useState<boolean[]>(
//     new Array(data.length).fill(false),
//   )
//   const [nodePositions, setNodePositions] = useState<number[]>([])

//   // Find the last phase with active tasks
//   const lastActivePhaseIndex = data
//     .map((item, index) => ({hasActive: item.hasActiveTasks ?? true, index}))
//     .reduceRight((last, current) => {
//       if (current.hasActive && last === -1) return current.index
//       return last
//     }, -1)

//   useEffect(() => {
//     if (ref.current) {
//       const rect = ref.current.getBoundingClientRect()
//       setHeight(rect.height)

//       // Calculate node positions relative to timeline container
//       const positions = data.map((_, index) => {
//         const node = document.getElementById(`phase-${index}-node`)
//         if (node && ref.current) {
//           return getRelativeTop(node, ref.current)
//         }
//         return 0
//       })
//       setNodePositions(positions)
//     }
//   }, [ref])

//   // Helper to calculate element's absolute position in document
//   const getAbsoluteTop = (element: HTMLElement): number => {
//     let top = 0
//     let el: HTMLElement | null = element

//     while (el) {
//       top += el.offsetTop
//       el = el.offsetParent as HTMLElement | null
//     }

//     return top
//   }

//   // Helper to calculate element's top position relative to container
//   const getRelativeTop = (
//     element: HTMLElement,
//     container: HTMLElement,
//   ): number => {
//     return getAbsoluteTop(element) - getAbsoluteTop(container)
//   }

//   // Calculate max progress height based on last active phase or stop marker
//   useEffect(() => {
//     const updateMaxHeight = () => {
//       if (!ref.current) {
//         setMaxProgressHeight(height)
//         return
//       }

//       const containerElement = ref.current

//       // First check if any phase has a stopProgressAt ref
//       const stopMarker = data.find((item) => item.stopProgressAt?.current)
//       if (stopMarker?.stopProgressAt?.current) {
//         const markerElement = stopMarker.stopProgressAt.current

//         // Calculate position relative to container
//         const relativeTop = getRelativeTop(markerElement, containerElement)
//         const markerHeight = markerElement.offsetHeight
//         setMaxProgressHeight(Math.max(0, relativeTop + markerHeight))
//         return
//       }

//       // Fallback to last active phase
//       if (phaseRefs.current.length === 0 || lastActivePhaseIndex === -1) {
//         setMaxProgressHeight(height)
//         return
//       }

//       const lastActivePhaseRef = phaseRefs.current[lastActivePhaseIndex]
//       if (lastActivePhaseRef) {
//         const relativeTop = getRelativeTop(lastActivePhaseRef, containerElement)
//         const phaseHeight = lastActivePhaseRef.offsetHeight
//         setMaxProgressHeight(Math.max(0, relativeTop + phaseHeight))
//       } else {
//         setMaxProgressHeight(height)
//       }
//     }

//     // Delay to ensure DOM is ready
//     const timeoutId = setTimeout(() => {
//       updateMaxHeight()
//     }, 100)

//     // Recalculate on resize
//     const resizeObserver = new ResizeObserver(() => {
//       updateMaxHeight()
//     })

//     if (ref.current) {
//       resizeObserver.observe(ref.current)
//     }

//     phaseRefs.current.forEach((phaseRef) => {
//       if (phaseRef) {
//         resizeObserver.observe(phaseRef)
//       }
//     })

//     // Also observe stop markers if they exist
//     data.forEach((item) => {
//       if (item.stopProgressAt?.current) {
//         resizeObserver.observe(item.stopProgressAt.current)
//       }
//     })

//     return () => {
//       clearTimeout(timeoutId)
//       resizeObserver.disconnect()
//     }
//   }, [height, lastActivePhaseIndex, data])

//   const {scrollYProgress} = useScroll({
//     target: containerRef,
//     container: scrollContainerRef,
//     offset: ['start 10%', 'end 55%'],
//   })

//   // Calculate the actual max height to use - stop at maxProgressHeight if set, otherwise use full height
//   const actualMaxHeight =
//     maxProgressHeight > 0 ? Math.min(height, maxProgressHeight) : height

//   // Transform scroll progress to height, stopping at actualMaxHeight
//   const heightTransform = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, actualMaxHeight],
//   )
//   const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

//   useMotionValueEvent(heightTransform, 'change', (latest) => {
//     const newActivePhases = nodePositions.map((pos) => latest > pos)
//     setActivePhases((prev) => {
//       if (JSON.stringify(prev) !== JSON.stringify(newActivePhases)) {
//         return newActivePhases
//       }
//       return prev
//     })
//   })

//   return (
//     <div
//       className='w-full bg-neutral-50 dark:bg-neutral-950 font-sans md:px-10 relative'
//       ref={containerRef}>
//       <div className='max-w-7xl mx-auto pt-12 md:pt-16 pb-8 px-6 md:px-8 lg:px-8'>
//         <h2 className='text-xl md:text-4xl mb-4 text-black dark:text-white max-w-5xl font-bold tracking-tighter'>
//           {title ?? 'Project Status'}
//           <span className='font-space text-2xl md:text-4xl px-4 font-semibold text-blue-400 dark:text-blue-400'>
//             {completion ?? '0'}
//             <span className='text-xl md:text-3xl'>%</span>
//           </span>
//         </h2>
//         <p className='opacity-70 text-sm md:text-lg max-w-2xl leading-relaxed'>
//           {description ?? 'Project has not started yet.'}
//         </p>
//       </div>

//       <div ref={ref} className='relative max-w-7xl mx-auto pb-20'>
//         {data.map((item, index) => (
//           <div
//             key={index}
//             ref={(el) => {
//               phaseRefs.current[index] = el
//             }}
//             className='flex justify-start pt-10 md:pt-32'>
//             <div
//               id={`phase-${index}`}
//               className='sticky flex flex-col md:flex-row z-40 items-center top-40 self-start w-fit md:max-w-xs md:w-full'>
//               <div
//                 id={`phase-${index}-node`}
//                 className='flex items-center justify-center size-8.5 md:size-9.5 absolute z-45 left-2 lg:left-3.5 rounded-full bg-white dark:bg-black shadow-lg dark:shadow-none border border-neutral-200 dark:border-transparent overflow-hidden'>
//                 <div
//                   className={`size-3 md:size-5 relative z-50 flex items-center justify-center rounded-full transition-colors duration-100 ${
//                     activePhases[index]
//                       ? 'bg-transparent dark:bg-transparent size-6'
//                       : 'bg-neutral-200 dark:bg-neutral-800'
//                   }`}>
//                   <Activity mode={activePhases[index] ? 'visible' : 'hidden'}>
//                     <div className='flex items-center justify-center relative'>
//                       <Icon
//                         name='sparkle-sharp'
//                         className='size-4 md:size-5 text-white scale-120 blur-sm absolute z-55 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'
//                       />
//                       <Icon
//                         name='sparkle-sharp'
//                         className='size-4 md:size-5 text-indigo-500 dark:text-white relative z-60 bg-transparent'
//                       />
//                     </div>
//                   </Activity>
//                 </div>
//               </div>
//               <h3
//                 id={`phase-${index}-title`}
//                 className={cn(
//                   'hidden md:block text-xl md:pl-20 md:text-3xl tracking-tight font-bold opacity-60',
//                   activePhases[index] && 'opacity-100',
//                 )}>
//                 {item.title}
//               </h3>
//             </div>

//             <div className='relative pl-20 pr-4 md:pl-4 w-full'>
//               <h3
//                 className={cn(
//                   'md:hidden block text-2xl mb-4 text-left font-bold opacity-60',
//                   activePhases[index] && 'opacity-100',
//                 )}>
//                 {item.title}
//               </h3>
//               {item.content}{' '}
//             </div>
//           </div>
//         ))}
//         <div
//           id='timeline-line'
//           style={{
//             height: height + 'px',
//           }}
//           className='absolute md:left-8 left-6 top-0 overflow-hidden w-0.5 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 dark:via-neutral-700 to-transparent to-99%  mask-image-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] '>
//           <motion.div
//             style={{
//               height: heightTransform,
//               opacity: opacityTransform,
//             }}
//             className='absolute inset-x-0 top-0 w-0.5 bg-linear-to-t dark:from-emerald-100 dark:via-emerald-100/20 from-purple-400 via-indigo-200 to-transparent from-0% via-10% rounded-full'
//           />
//         </div>
//       </div>
//     </div>
//   )
// }
