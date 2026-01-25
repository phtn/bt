'use client'

import { useEffect, useState } from 'react'
import { EndpointForm } from './components/EndpointForm'
import { EndpointSelector } from './components/EndpointSelector'
import { RequestTypesDisplay } from './components/RequestTypesDisplay'
import { ResponseDisplay } from './components/shared/ResponseDisplay'
import { getEndpointById, meldEndpoints } from './endpoints'
import { useCountryDetection } from './hooks/useCountryDetection'
import { useMeldApiCall } from './hooks/useMeldApiCall'
import type { MeldEnvironment } from './types'

export const MeldContent = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(meldEndpoints[0]?.id || 'health')
  const [apiKey, setApiKey] = useState<string>('')
  const { loading, response, handleApiCall } = useMeldApiCall()
  const { countryCode } = useCountryDetection()

  // Load API key from environment
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const res = await fetch('/api/meld/config')
        if (res.ok) {
          const data = await res.json()
          if (data.apiKey) {
            setApiKey(data.apiKey)
          }
        }
      } catch (error) {
        console.error('Failed to load API key:', error)
      }
    }
    loadApiKey()
  }, [])

  const selectedEndpoint = getEndpointById(selectedEndpointId)

  const handleSubmit = (
    endpoint: string,
    apiKey: string,
    environment: MeldEnvironment,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: unknown,
    params?: Record<string, string>
  ) => {
    handleApiCall(endpoint, apiKey, environment, method, body, params)
  }

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-0'>
      <div className='w-full h-full'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-0'>
          {/* Endpoint Selector */}
          <div className='lg:col-span-2'>
            <EndpointSelector selectedEndpoint={selectedEndpointId} onSelect={setSelectedEndpointId} />
          </div>

          {/* Form with Request Types */}
          <div className='lg:col-span-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
              {/* Form */}
              <div>
                {selectedEndpoint && (
                  <EndpointForm
                    endpoint={selectedEndpoint}
                    onSubmit={handleSubmit}
                    loading={loading}
                    apiKey={apiKey}
                    countryCode={countryCode}
                  />
                )}
              </div>

              {/* Request Types */}
              <div>
                <RequestTypesDisplay endpoint={selectedEndpoint} />
              </div>
            </div>
          </div>

          {/* Response */}
          <div className='lg:col-span-4'>
            <ResponseDisplay response={response} />
          </div>
        </div>
      </div>
    </div>
  )
}
