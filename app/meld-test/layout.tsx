import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense, type ReactNode } from 'react'
import { ProjectProvider } from '../project/context'

export default function MeldTestLayout({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <Suspense fallback={<div className='p-6 dark:bg-black'>Loading...</div>}>
        <ProjectProvider>{children}</ProjectProvider>
      </Suspense>
    </NuqsAdapter>
  )
}
