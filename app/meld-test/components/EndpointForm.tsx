'use client'

import { Title } from '@/components/ui/title'
import type { EndpointConfig } from '../endpoints'
import { hasBodySchema } from '../endpoints'
import { useEndpointForm } from '../hooks/useEndpointForm'
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
  onRequestChange?: (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers: Record<string, string>,
    body?: unknown,
    params?: Record<string, string>
  ) => void
  loading: boolean
  apiKey: string
  countryCode: string
}

export function EndpointForm({ endpoint, onSubmit, onRequestChange, loading, apiKey, countryCode }: EndpointFormProps) {
  const { environment, setEnvironment, paramValues, bodyValues, setParamValue, setBodyValue, buildSubmitRequest } =
    useEndpointForm({
      endpoint,
      apiKey,
      countryCode,
      onRequestChange
    })

  // Helper to get the value for a param, checking both bodyValues and paramValues
  // This ensures inputs update correctly when a param exists in both places
  const getParamValue = (paramName: string, isBodyParam: boolean): string => {
    if (isBodyParam && hasBodySchema(endpoint) && paramName in endpoint.bodySchema) {
      // For body params, prefer bodyValues but fallback to paramValues
      return bodyValues[paramName] || paramValues[paramName] || ''
    }
    // For non-body params, use paramValues
    return paramValues[paramName] || ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) {
      alert('API key is required')
      return
    }

    const { body, params } = buildSubmitRequest()
    onSubmit(endpoint.path, apiKey, environment, endpoint.method, body, params)
  }

  return (
    <form onSubmit={handleSubmit} className='bg-white dark:bg-zinc-900 p-4 space-y-6'>
      <Title text='Endpoint Form' />
      <div className='space-y-4'>
        <FormField label='environment' required>
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
            <Title text='Parameters' />
            <div className='grid grid-cols-1 gap-3'>
              {endpoint.params.map((param) => {
                const isPathParam = endpoint.path.includes(`{${param.name}}`)
                const isBodyParam = (endpoint.method === 'POST' || endpoint.method === 'PUT') && !isPathParam
                const isCountryCode = param.name === 'countryCode' && endpoint.id === 'quote'

                if (isBodyParam && hasBodySchema(endpoint)) {
                  const paramValue = getParamValue(param.name, true)
                  return (
                    <FormField
                      key={param.name}
                      label={param.name}
                      required={param.required}
                      helperText={isCountryCode ? 'Auto-detected from your location' : param.description}>
                      <div className='space-y-0 flex flex-col w-full items-end'>
                        <input
                          type='text'
                          value={isCountryCode ? countryCode : paramValue}
                          onChange={(e) => !isCountryCode && setBodyValue(param.name, e.target.value || null)}
                          placeholder={param.examples[0] || ''}
                          disabled={isCountryCode}
                          className='w-full max-w-64 px-3 py-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed text-right'
                          required={param.required}
                        />
                        {!isCountryCode && (
                          <div className='flex justify-end flex-wrap'>
                            {param.examples.map((example, idx) => (
                              <button
                                key={idx}
                                type='button'
                                onClick={() => setBodyValue(param.name, example || null)}
                                className='font-brk text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 truncate max-w-[25ch]'>
                                {example}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormField>
                  )
                }

                const paramValue = getParamValue(param.name, false)
                return (
                  <FormField
                    key={param.name}
                    label={param.name}
                    required={param.required}
                    helperText={isCountryCode ? 'Auto-detected from your location' : param.description}>
                    <div className='space-y-2'>
                      <input
                        type='text'
                        value={isCountryCode ? countryCode : paramValue}
                        onChange={(e) => !isCountryCode && setParamValue(param.name, e.target.value || null)}
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
                              onClick={() => setParamValue(param.name, example || null)}
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
