'use client'

import { useEffect, useState } from 'react'
import { useProjectContext } from '../project/context'
import { EndpointForm } from './components/EndpointForm'
import { EndpointSelector } from './components/EndpointSelector'
import { RequestTypes } from './components/RequestTypes'
import { ResponseDisplay } from './components/shared/ResponseDisplay'
import { getEndpointById, meldEndpoints } from './endpoints'
import { useCountryDetection } from './hooks/useCountryDetection'
import { useMeldApiCall } from './hooks/useMeldApiCall'
import type { MeldEnvironment, RequestPreview } from './types'

export const MeldContent = () => {
  const projectContext = useProjectContext()
  const defaultEndpointId = meldEndpoints[0]?.id || 'health'
  const contextEndpointId = projectContext?.meldEndpointId || null
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(contextEndpointId || defaultEndpointId)
  const [apiKey, setApiKey] = useState<string>('')
  const [requestPreview, setRequestPreview] = useState<RequestPreview | null>(null)
  const { loading, response, handleApiCall } = useMeldApiCall()
  const { countryCode } = useCountryDetection()

  // Sync with context when it changes
  // useEffect(() => {
  //   if (contextEndpointId) {
  //     setSelectedEndpointId(contextEndpointId)
  //   }
  // }, [contextEndpointId])

  // Update context when endpoint changes
  const handleEndpointChange = (id: string) => {
    setSelectedEndpointId(id)
    projectContext?.setMeldEndpointId(id)
  }

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

  const handleRequestChange = (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers: Record<string, string>,
    body?: unknown,
    params?: Record<string, string>
  ) => {
    setRequestPreview({
      url,
      method,
      headers,
      body,
      params
    })
  }

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-0'>
      <div className='w-full h-full'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-0'>
          {/* Endpoint Selector */}
          <div className='lg:col-span-2'>
            <EndpointSelector selectedEndpoint={selectedEndpointId} onSelect={handleEndpointChange} />
          </div>

          {/* Form with Request Types */}
          <div className='lg:col-span-6'>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-0'>
              {/* Form */}
              <div className='lg:col-span-2'>{selectedEndpoint && <RequestTypes endpoint={selectedEndpoint} />}</div>

              {/* Request Types */}
              <div className='lg:col-span-3'>
                {selectedEndpoint && (
                  <EndpointForm
                    endpoint={selectedEndpoint}
                    onSubmit={handleSubmit}
                    onRequestChange={handleRequestChange}
                    loading={loading}
                    apiKey={apiKey}
                    countryCode={countryCode}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Response */}
          <div className='lg:col-span-4'>
            <ResponseDisplay
              response={response}
              requestPreview={requestPreview}
              responseWithURL={selectedEndpoint?.responseWithURL}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
