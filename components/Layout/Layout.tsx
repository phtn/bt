import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className='relative flex h-auto min-h-screen w-full flex-col group/design-root'>
      <div className='layout-container flex h-full grow flex-col'>{children}</div>
    </div>
  )
}

interface LayoutContentProps {
  children: ReactNode
  className?: string
}

export function LayoutContent({ children, className = '' }: LayoutContentProps) {
  return (
    <div className={`w-full flex justify-center px-4 md:px-10 ${className}`}>
      <div className='layout-content-container flex flex-col w-full max-w-300'>{children}</div>
    </div>
  )
}
