'use client'

import { useEffect, useState } from 'react'
import type { EndpointConfig } from '../endpoints'
import type { MeldEnvironment } from '../types'
import { FormField } from './shared/FormField'

interface EndpointFormProps {
  endpoint: EndpointConfig
  onSubmit: (
    endpoint: string,
    apiKey: string,
    environment: MeldEnvironment,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: unknown,
    params?: Record<string, string>
  ) => void
  loading: boolean
  apiKey: string
  countryCode: string
}

export function EndpointForm({ endpoint, onSubmit, loading, apiKey, countryCode }: EndpointFormProps) {
  const [environment, setEnvironment] = useState<MeldEnvironment>('sandbox')
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({})

  // Initialize with first example value for each param
  useEffect(() => {
    const initialParams: Record<string, string> = {}
    const initialBody: Record<string, string> = {}

    endpoint.params?.forEach((param) => {
      // Auto-fill countryCode if it's the quote endpoint
      if (param.name === 'countryCode' && endpoint.id === 'quote') {
        initialParams[param.name] = countryCode
      } else if (param.examples.length > 0) {
        initialParams[param.name] = param.examples[0] || ''
      }
    })

    if (endpoint.bodySchema) {
      Object.keys(endpoint.bodySchema).forEach((key) => {
        // Auto-fill countryCode in body for quote endpoint
        if (key === 'countryCode' && endpoint.id === 'quote') {
          initialBody[key] = countryCode
        } else {
          const param = endpoint.params?.find((p) => p.name === key)
          if (param && param.examples.length > 0) {
            initialBody[key] = param.examples[0] || ''
          }
        }
      })
    }

    setParamValues(initialParams)
    setBodyValues(initialBody)
  }, [endpoint, countryCode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) {
      alert('API key is required')
      return
    }

    let finalPath = endpoint.path
    const pathParams: Record<string, string> = {}
    const queryParams: Record<string, string> = {}

    // Separate path params from query params
    endpoint.params?.forEach((param) => {
      const value = paramValues[param.name]
      if (value) {
        if (endpoint.path.includes(`{${param.name}}`)) {
          pathParams[param.name] = value
        } else if (endpoint.method === 'GET') {
          queryParams[param.name] = value
        }
      }
    })

    let body: unknown | undefined
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      const bodyObj: Record<string, unknown> = {}
      Object.entries(bodyValues).forEach(([key, value]) => {
        if (value) {
          // Try to parse as number if it looks like a number
          const numValue = Number(value)
          bodyObj[key] = isNaN(numValue) ? value : numValue
        }
      })
      // Also include params that aren't path params for POST/PUT
      endpoint.params?.forEach((param) => {
        const value = paramValues[param.name]
        if (value && !endpoint.path.includes(`{${param.name}}`)) {
          const numValue = Number(value)
          bodyObj[param.name] = isNaN(numValue) ? value : numValue
        }
      })
      // Auto-inject countryCode for quote endpoint if not already present
      if (endpoint.id === 'quote' && !bodyObj.countryCode && countryCode) {
        bodyObj.countryCode = countryCode
      }
      body = Object.keys(bodyObj).length > 0 ? bodyObj : undefined
    }

    const allParams = endpoint.method === 'GET' ? queryParams : { ...pathParams, ...queryParams }

    onSubmit(endpoint.path, apiKey, environment, endpoint.method, body, allParams)
  }

  const setParamValue = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }))
  }

  const setBodyValue = (name: string, value: string) => {
    setBodyValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-6'>
      <div>
        <h2 className='text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1'>{endpoint.name}</h2>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>{endpoint.description}</p>
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-xs font-mono px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'>
            {endpoint.method}
          </span>
          <span className='text-xs font-mono text-zinc-500 dark:text-zinc-400'>{endpoint.path}</span>
        </div>
      </div>

      <div className='space-y-4'>
        <FormField label='Environment' required>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as MeldEnvironment)}
            className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600'>
            <option value='sandbox'>Sandbox (api-sb.meld.io)</option>
            <option value='production'>Production (api.meld.io)</option>
          </select>
        </FormField>

        {endpoint.params && endpoint.params.length > 0 && (
          <div className='space-y-4'>
            <div className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide'>
              Parameters
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {endpoint.params.map((param) => {
              const isPathParam = endpoint.path.includes(`{${param.name}}`)
              const isQueryParam = endpoint.method === 'GET' && !isPathParam
              const isBodyParam = (endpoint.method === 'POST' || endpoint.method === 'PUT') && !isPathParam
              const isCountryCode = param.name === 'countryCode' && endpoint.id === 'quote'

              if (isBodyParam && endpoint.bodySchema) {
                return (
                  <FormField
                    key={param.name}
                    label={param.name}
                    required={param.required}
                    helperText={isCountryCode ? 'Auto-detected from your location' : param.description}>
                    <div className='space-y-2'>
                      <input
                        type='text'
                        value={isCountryCode ? countryCode : (bodyValues[param.name] || '')}
                        onChange={(e) => !isCountryCode && setBodyValue(param.name, e.target.value)}
                        placeholder={param.examples[0] || ''}
                        disabled={isCountryCode}
                        className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed'
                        required={param.required}
                      />
                      {!isCountryCode && (
                        <div className='flex flex-wrap gap-1'>
                          {param.examples.map((example, idx) => (
                            <button
                              key={idx}
                              type='button'
                              onClick={() => setBodyValue(param.name, example)}
                              className='text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'>
                              {example}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormField>
                )
              }

              return (
                <FormField key={param.name} label={param.name} required={param.required} helperText={isCountryCode ? 'Auto-detected from your location' : param.description}>
                  <div className='space-y-2'>
                    <input
                      type='text'
                      value={isCountryCode ? countryCode : (paramValues[param.name] || '')}
                      onChange={(e) => !isCountryCode && setParamValue(param.name, e.target.value)}
                      placeholder={param.examples[0] || ''}
                      disabled={isCountryCode}
                      className='w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed'
                      required={param.required}
                    />
                    {!isCountryCode && (
                      <div className=' grid grid-cols-2 gap-1'>
                        {param.examples.map((example, idx) => (
                          <button
                            key={idx}
                            type='button'
                            onClick={() => setParamValue(param.name, example)}
                            className='text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'>
                            {example}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>
              )
            })}
            </div>
          </div>
        )}
      </div>

      <button
        type='submit'
        disabled={loading || !apiKey}
        className='w-full px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
        {loading ? 'Loading...' : 'Send Request'}
      </button>
    </form>
  )
}
