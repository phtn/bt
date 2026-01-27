'use client'

import { Suspense } from 'react'
import { ProjectTabs } from '.'
import { ProjectProvider } from './context'

//
export const Content = () => {
  return (
    <main className='p-6 dark:bg-black'>
      <Suspense fallback={<div className='p-6 dark:bg-black'>Loading...</div>}>
        <ProjectProvider>
          <ProjectTabs />
        </ProjectProvider>
      </Suspense>
    </main>
  )
}
