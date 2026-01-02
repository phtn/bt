// import {useToggle} from '@/hooks/use-toggle'
// import {Icon} from '@/lib/icons'
// import {cn} from '@/lib/utils'
// import {AnimatePresence, motion} from 'motion/react'
// import {Activity, useEffect, useState} from 'react'
// import {Input} from './input'
// import {Popover, PopoverContent, PopoverTrigger} from './popover'

// interface PickerProps {
//   color: string
//   onChange: (color: string) => void
// }

// export const NewPicker = ({color, onChange}: PickerProps) => {
//   const {on: isOpen, toggle} = useToggle()
//   const {on: showInput, toggle: toggleShowInput} = useToggle()
//   const [hsl, setHsl] = useState<[number, number, number]>([0, 0, 0])
//   const [colorInput, setColorInput] = useState(color)

//   useEffect(() => {
//     handleColorChange(color)
//   }, [color])

//   const handleColorChange = (newColor: string) => {
//     const normalizedColor = normalizeColor(newColor)
//     setColorInput(normalizedColor)

//     let h, s, l
//     if (normalizedColor.startsWith('#')) {
//       ;[h, s, l] = hexToHsl(normalizedColor)
//     } else {
//       ;[h, s, l] = normalizedColor.match(/\d+(\.\d+)?/g)?.map(Number) || [
//         0, 0, 0,
//       ]
//     }

//     setHsl([h, s, l])
//     onChange(`hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`)
//   }

//   // const handleHueChange = (e: ChangeEvent<HTMLInputElement>) => {
//   //   const hue = Number(e.target.value)
//   //   const newHsl: [number, number, number] = [hue, hsl[1], hsl[2]]
//   //   setHsl(newHsl)
//   //   setColorInput(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`)
//   //   onChange(`hsl(${newHsl[0].toFixed(1)}, ${newHsl[1].toFixed(1)}%, ${newHsl[2].toFixed(1)}%)`)
//   // }

//   const handleSaturationLightnessChange = (
//     event: React.MouseEvent<HTMLDivElement>,
//   ) => {
//     const rect = event.currentTarget.getBoundingClientRect()
//     const x = event.clientX - rect.left
//     const y = event.clientY - rect.top
//     const s = Math.round((x / rect.width) * 100)
//     const l = Math.round(100 - (y / rect.height) * 100)
//     const newHsl: [number, number, number] = [hsl[0], s, l]
//     setHsl(newHsl)
//     setColorInput(`hsl(${newHsl[0]}, ${newHsl[1]}%, ${newHsl[2]}%)`)
//     onChange(
//       `hsl(${newHsl[0].toFixed(1)}, ${newHsl[1].toFixed(1)}%, ${newHsl[2].toFixed(1)}%)`,
//     )
//   }

//   const handleColorInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const newColor = event.target.value
//     setColorInput(newColor)
//     if (
//       /^#[0-9A-Fa-f]{6}$/.test(newColor) ||
//       /^hsl$$\d+,\s*\d+%,\s*\d+%$$$/.test(newColor)
//     ) {
//       handleColorChange(newColor)
//     }
//   }

//   const GradientOut = ({color}: {color: string}) => {
//     // Get hex value - either from preset or convert from HSL
//     let hex: string
//     const preset = colorPresets.find((p) => p.hex === color)
//     if (preset) {
//       hex = preset.hex
//     } else if (color.startsWith('#')) {
//       hex = color
//     } else {
//       // Convert HSL to hex
//       hex = hslToHex(hsl[0], hsl[1], hsl[2])
//     }
//     return (
//       <div className=' flex items-center space-x-2'>
//         {[1, 0.85, 0.65, 0.45, 0.2].map((opacity, i) => (
//           <div
//             key={i}
//             className='size-4 aspect-square rounded-full'
//             style={{backgroundColor: hex, opacity}}></div>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <Popover open={isOpen} onOpenChange={toggle}>
//       <PopoverTrigger asChild>
//         <Icon name='paint' className='size-5' />
//       </PopoverTrigger>
//       <PopoverContent
//         sideOffset={10}
//         className='w-72 p-0 rounded-3xl dark:bg-terminal dark:inset-shadow-[0_1px_rgb(255_255_255/0.20)] inset-shadow-[0_1px_rgb(237_237_237)]/30'>
//         <div className='bg-origin rounded-3xl p-3 py-4 dark:bg-greyed/80'>
//           <motion.div
//             initial={{opacity: 0, scale: 0.95}}
//             animate={{opacity: 1, scale: 1}}
//             exit={{opacity: 0, scale: 0.95}}
//             transition={{duration: 0.2}}
//             className='space-y-3'>
//             <motion.div
//               className='w-full h-36 dark:bg-greyed/80 shadow-xs shadow-vim rounded-xl cursor-crosshair relative overflow-hidden'
//               style={{
//                 background: `
//                     linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
//                     linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 0, 0, 0)),
//                     hsl(${hsl[0]}, 100%, 50%)
//                   `,
//               }}
//               onClick={handleSaturationLightnessChange}>
//               <motion.div
//                 className='w-4 h-4 dark:bg-greyed/80  rounded-full border-2 border-white absolute shadow-md'
//                 style={{
//                   left: `${hsl[1]}%`,
//                   top: `${100 - hsl[2]}%`,
//                   backgroundColor: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
//                 }}
//                 whileHover={{scale: 1.2}}
//                 whileTap={{scale: 0.9}}
//               />
//             </motion.div>
//             {/*<motion.input
//               type='range'
//               min='0'
//               max='360'
//               value={hsl[0]}
//               onChange={handleHueChange}
//               className='w-full h-3 rounded-full appearance-none cursor-pointer shadow-none'
//               style={{
//                 background: `linear-gradient(to right,
//                     hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%),
//                     hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%)
//                   )`,
//               }}
//               whileHover={{scale: 1.05}}
//               whileTap={{scale: 0.95}}
//             />*/}
//             <div className='flex items-center space-x-2'>
//               <div className='grow h-8 relative w-full'>
//                 <div className='absolute grow flex items-center space-x-4 px-2 bg-white dark:bg-dysto z-0 h-full w-full rounded-md'>
//                   <div className='whitespace-nowrap opacity-80 w-full text-lg tracking-tighter leading-relaxed font-space'>
//                     {/*{(() => {
//                       const preset = colorPresets.find(
//                         (preset) => preset.hex === colorInput,
//                       )
//                       if (preset) {
//                         return preset.name
//                       }
//                       if (colorInput.startsWith('#')) {
//                         return colorInput
//                       }
//                       return hslToHex(hsl[0], hsl[1], hsl[2])
//                     })()}*/}
//                   </div>
//                   <GradientOut color={colorInput} />
//                 </div>
//                 <Activity mode={showInput ? 'visible' : 'hidden'}>
//                   <Input
//                     id='color-input'
//                     type='text'
//                     value={colorInput}
//                     onChange={handleColorInputChange}
//                     className='relative z-20 grow bg-white dark:bg-background border-0 rounded-md text-sm h-8 px-2 shadow-none'
//                     placeholder='#RRGGBB or hsl(h, s%, l%)'
//                   />
//                 </Activity>
//               </div>
//               <motion.div
//                 className='w-8 h-8 aspect-square rounded-md shadow-sm relative'
//                 style={{backgroundColor: colorInput}}
//                 whileHover={{scale: 1.1}}
//                 whileTap={{scale: 0.9}}>
//                 <Icon
//                   name={showInput ? 'disconnect' : 'pen-ink'}
//                   onClick={toggleShowInput}
//                   className={cn(
//                     'invert absolute inset-0 m-auto transition-tranform duration-300 ease-in-out rotate-0',
//                     {
//                       'size-6 rotate-180': showInput,
//                     },
//                   )}
//                   style={{color: colorInput}}
//                 />
//               </motion.div>
//             </div>
//             <div className='h-40 grid grid-cols-7 gap-0'>
//               <AnimatePresence>
//                 {colorPresets.map((preset, idx) => (
//                   <motion.button
//                     key={preset.id}
//                     className='relative flex items-center justify-center h-9'
//                     onClick={() => handleColorChange(preset.hex)}
//                     whileHover={{scale: 1.2, zIndex: 1}}
//                     whileTap={{scale: 0.9}}>
//                     <Icon
//                       name='sqrc'
//                       className='size-12'
//                       style={{color: preset.hex}}
//                     />
//                     {colorInput === preset.hex ? (
//                       <motion.div
//                         initial={{scale: 0}}
//                         animate={{scale: 1}}
//                         exit={{scale: 0}}
//                         transition={{duration: 0.2}}>
//                         <Icon
//                           name='check'
//                           className='w-4 h-4 text-white absolute inset-0 m-auto'
//                         />
//                       </motion.div>
//                     ) : null}
//                   </motion.button>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

// const hexToHsl = (hex: string): [number, number, number] => {
//   // Option 1: Direct string slicing (faster than regex)
//   const r = parseInt(hex.slice(1, 3), 16) / 255
//   const g = parseInt(hex.slice(3, 5), 16) / 255
//   const b = parseInt(hex.slice(5, 7), 16) / 255

//   const max = Math.max(r, g, b)
//   const min = Math.min(r, g, b)
//   const l = (max + min) / 2

//   if (max === min) {
//     return [0, 0, Math.round(l * 100)]
//   }

//   const d = max - min
//   const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

//   let h: number
//   if (max === r) {
//     h = (g - b) / d + (g < b ? 6 : 0)
//   } else if (max === g) {
//     h = (b - r) / d + 2
//   } else {
//     h = (r - g) / d + 4
//   }

//   return [Math.round((h / 6) * 360), Math.round(s * 100), Math.round(l * 100)]
// }

// export const hslToHex = (h: number, s: number, l: number): string => {
//   const lNorm = l / 100
//   const a = (s * Math.min(lNorm, 1 - lNorm)) / 100
//   const hDiv30 = h / 30

//   const f = (n: number): string => {
//     const k = (n + hDiv30) % 12
//     const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
//     return Math.round(255 * color)
//       .toString(16)
//       .padStart(2, '0')
//   }

//   return `#${f(0)}${f(8)}${f(4)}`
// }

// // MAXXED-OUT PERFORMA
// const normalizeColor = (color: string): string => {
//   const firstChar = color.charCodeAt(0)

//   // Check for '#' (char code 35)
//   if (firstChar === 35) {
//     return color.toUpperCase()
//   }

//   // Check for 'h' (char code 104)
//   if (firstChar === 104) {
//     let h = 0
//     let s = 0
//     let l = 0
//     let num = 0
//     let hasNum = false

//     for (let i = 4; i < color.length; i++) {
//       const code = color.charCodeAt(i)
//       // '0'-'9' are char codes 48-57
//       if (code >= 48 && code <= 57) {
//         num = num * 10 + (code - 48)
//         hasNum = true
//       } else if (hasNum) {
//         if (h === 0) h = num
//         else if (s === 0) s = num
//         else {
//           l = num
//           break
//         }
//         num = 0
//         hasNum = false
//       }
//     }
//     if (hasNum) l = num

//     return `hsl(${h}, ${s}%, ${l}%)`
//   }

//   return color
// }

// export const normalizeColor2 = (color: string): string => {
//   if (color.charCodeAt(0) === 35) return color.toUpperCase()
//   if (color.charCodeAt(0) === 104) {
//     const nums = color.match(/\d+/g)
//     if (!nums) return color
//     return `hsl(${nums[0]}, ${nums[1]}%, ${nums[2]}%)`
//   }
//   return color
// }

// interface NewThemePickerProps {
//   value?: string | null
//   onChange: (value: string) => void
// }

// export const NewThemePicker = ({value, onChange}: NewThemePickerProps) => {
//   // Convert hex to HSL format if value is hex, otherwise use value as-is
//   const getColorForPicker = (): string => {
//     if (!value) return '#000000'
//     // If it's already HSL format, use it directly
//     if (value.startsWith('hsl(')) return value
//     // If it's hex, convert to HSL for the picker
//     if (value.startsWith('#')) {
//       const [h, s, l] = hexToHsl(value)
//       return `hsl(${h}, ${s}%, ${l}%)`
//     }
//     // Default fallback
//     return value
//   }

//   return (
//     <div className='relative'>
//       <div className='flex items-center'>
//         <NewPicker color={getColorForPicker()} onChange={onChange} />
//       </div>
//     </div>
//   )
// }

// interface HexColor {
//   id: number
//   hex: string
//   name: string
// }

// const colorPresets: HexColor[] = [
//   {id: 1, hex: '#FF3B30', name: 'Pudge'},
//   {id: 2, hex: '#FF9500', name: 'Axe'},
//   {id: 3, hex: '#FFCC00', name: 'Earthshaker'},
//   {id: 4, hex: '#4CD964', name: 'Crystal Maiden'},
//   {id: 5, hex: '#007AFF', name: 'Lion'},
//   {id: 6, hex: '#FC81FE', name: 'Tinker'},
//   {id: 7, hex: '#5856D6', name: 'Puck'},
//   {id: 8, hex: '#65DCC3', name: 'Razor'},
//   {id: 9, hex: '#BEBEBE', name: 'Shadow Fiend'},
//   {id: 10, hex: '#FDBA74', name: 'Sven'},
//   {id: 11, hex: '#FF5B57', name: 'Bloodseeker'},
//   {id: 12, hex: '#D1D1D6', name: 'Night Stalker'},
//   {id: 13, hex: '#1A1A2E', name: 'Doom'},
//   {id: 14, hex: '#2C3E50', name: 'Lifestealer'},
//   {id: 15, hex: '#3498DB', name: 'Morphling'},
//   {id: 16, hex: '#3357FF', name: 'Tiny'},
//   {id: 17, hex: '#14532D', name: 'Zeus'},
//   {id: 18, hex: '#312E81', name: 'Necro'},
//   {id: 19, hex: '#EEEE8B', name: 'Queen of Pain'},
//   {id: 20, hex: '#D4DADB', name: 'Windrunner'},
//   {id: 21, hex: '#8FA0A8', name: 'Mirana'},
//   {id: 22, hex: '#F37021', name: 'Bounty Hunter'},
//   {id: 23, hex: '#10B981', name: 'Riki'},
//   {id: 24, hex: '#1E293B', name: 'Sniper'},
// ]
