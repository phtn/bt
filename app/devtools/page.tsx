'use client'

import { useState } from 'react'
import { TabNavigation } from './components/TabNavigation'
import { UrlEncoderDecoder } from './components/UrlEncoderDecoder'
import { Base64EncoderDecoder } from './components/Base64EncoderDecoder'
import { JsonFormatter } from './components/JsonFormatter'
import { HtmlEncoderDecoder } from './components/HtmlEncoderDecoder'
import type { DevToolType } from './types'

export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState<DevToolType>('url')

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-screen mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2 space-x-2 tracking-tighter'>
            <span>DevTools</span> <span className='font-normal opacity-70'>utilities</span>
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>Useful development tools for encoding, decoding, and formatting</p>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className='mt-6'>
          {activeTab === 'url' && <UrlEncoderDecoder />}
          {activeTab === 'base64' && <Base64EncoderDecoder />}
          {activeTab === 'json' && <JsonFormatter />}
          {activeTab === 'html' && <HtmlEncoderDecoder />}
        </div>
      </div>
    </div>
  )
}

