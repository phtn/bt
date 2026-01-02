'use client'

import { useState } from 'react'
import { ConfigForm } from './components/ConfigForm'
import { GenericEndpointForm } from './components/GenericEndpointForm'
import { GetQuote } from './components/get-quote'
import { HealthCheckForm } from './components/HealthCheckForm'
import { ResponseDisplay } from './components/shared/ResponseDisplay'
import { TabNavigation } from './components/TabNavigation'
import { useMeldApiCall } from './hooks/useMeldApiCall'
import type { EndpointType, MeldEnvironment } from './types'

export const MeldContent = () => {
  const [activeTab, setActiveTab] = useState<EndpointType>('generic')
  const { loading, response, handleApiCall } = useMeldApiCall()

  // Handler for generic endpoint
  const handleGenericSubmit = (
    endpoint: string,
    apiKey: string,
    environment: MeldEnvironment,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: string
  ) => {
    let parsedBody: unknown
    if (body) {
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        alert('Invalid JSON in request body')
        console.log(e)
        return
      }
    }
    handleApiCall(endpoint, apiKey, environment, method, parsedBody)
  }

  // Handler for health check
  const handleHealthCheckSubmit = (apiKey: string, environment: MeldEnvironment) => {
    handleApiCall('/v1/health', apiKey, environment, 'GET')
  }

  // Handler for config
  const handleConfigSubmit = (apiKey: string, environment: MeldEnvironment) => {
    handleApiCall('/v1/config', apiKey, environment, 'GET')
  }
  // Handler for quote
  const handleQuoteSubmit = async () => {
    const response = await fetch('/api/meld', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-screen mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2 space-x-2 tracking-tighter'>
            <span>Meld</span> <span className='font-normal opacity-70'>api-tester</span>
          </h1>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Forms */}
          <div className='space-y-6'>
            {activeTab === 'generic' && <GenericEndpointForm onSubmit={handleGenericSubmit} loading={loading} />}

            {activeTab === 'health' && <HealthCheckForm onSubmit={handleHealthCheckSubmit} loading={loading} />}

            {activeTab === 'config' && <ConfigForm onSubmit={handleConfigSubmit} loading={loading} />}
            {activeTab === 'quote' && <GetQuote onSubmit={handleQuoteSubmit} />}
          </div>

          {/* Response Display */}
          <div className='lg:col-span-2 space-y-6'>
            <ResponseDisplay response={response} />

            {/* Info Box */}
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>📚 Documentation</h3>
              <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>For detailed API documentation, visit:</p>
              <a
                href='https://docs.meld.io'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 dark:text-blue-400 hover:underline text-sm'>
                Meld API Documentation →
              </a>
              <div className='mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1'>
                <p>
                  <strong>Sandbox:</strong> https://api-sb.meld.io
                </p>
                <p>
                  <strong>Production:</strong> https://api.meld.io
                </p>
                <p>
                  <strong>Authentication:</strong> BASIC {`{API_KEY}`} in Authorization header
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
