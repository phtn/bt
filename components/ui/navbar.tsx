// 'use client'
// import { NavbarCtxProvider } from '@/ctx/navbar'
// import { Icon } from '@/lib/icons'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { memo, useMemo, type ReactNode } from 'react'

// interface NavbarProps {
//   children?: ReactNode
//   hideOnMobile?: boolean
//   label?: ReactNode
// }

// const Nav = memo(({ children, hideOnMobile, label }: NavbarProps) => {
//   const pathname = usePathname()

//   // Memoize pathname computation to prevent recalculation
//   const route = useMemo(() => pathname.split('/').pop(), [pathname])

//   // Memoize className computations
//   const navClassName = useMemo(
//     () =>
//       cn('h-[10lvh] md:h-[12lvh] flex items-center justify-between py-6 w-screen md:max-w-6xl mx-auto', {
//         'hidden md:flex': hideOnMobile,
//         'absolute md:max-w-full md:px-8': route === 'pricing'
//       }),
//     [hideOnMobile, route]
//   )

//   const iconClassName = useMemo(
//     () =>
//       cn('h-20 md:h-32 w-auto aspect-auto text-foreground', {
//         'text-background': route === 'pricing'
//       }),
//     [route]
//   )

//   return (
//     <nav className={navClassName}>
//       <Link href='/alpha' className='flex items-center px-4 md:px-0'>
//         {label ? (
//           <span className='md:text-3xl tracking-tighter font-space font-light'>{label}</span>
//         ) : (
//           <Icon name='re-up.ph' className={iconClassName} />
//         )}
//       </Link>
//       <div>{children}</div>
//     </nav>
//   )
// })

// Nav.displayName = 'Nav'
// export const Navbar = memo(({ children, hideOnMobile = false, label }: NavbarProps) => {
//   return (
//     <NavbarCtxProvider>
//       <Nav hideOnMobile={hideOnMobile} label={label}>
//         {children}
//       </Nav>
//     </NavbarCtxProvider>
//   )
// })

// Navbar.displayName = 'Navbar'
