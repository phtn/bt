import { Method } from '@/components/ui/method'
import { Title } from '@/components/ui/title'
import type { ApiResponse, RequestPreview } from '../../types'

interface ResponseDisplayProps {
  response: ApiResponse | null
  requestPreview?: RequestPreview | null
  responseWithURL?: string
}

export function ResponseDisplay({ response, requestPreview, responseWithURL }: ResponseDisplayProps) {
  // Use response data if available, otherwise use request preview
  const displayUrl = response?.url || requestPreview?.url
  const displayMethod = response?.method || requestPreview?.method
  const displayHeaders = response?.headers || requestPreview?.headers
  const displayBody = response?.body !== undefined ? response.body : requestPreview?.body
  const displayParams = response?.params || requestPreview?.params

  // Extract URL from response data if responseWithURL is specified
  const getResponseURL = (): string | null => {
    if (!responseWithURL || !response?.data) {
      return null
    }

    try {
      const data = response.data
      // Support dot notation for nested properties (e.g., "session.url" or "data.widgetUrl")
      const keys = responseWithURL.split('.')
      let value: unknown = data

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = (value as Record<string, unknown>)[key]
        } else {
          return null
        }
      }

      if (typeof value === 'string' && value.trim()) {
        return value
      }
    } catch {
      // If extraction fails, return null
    }

    return null
  }

  const responseURL = getResponseURL()

  if (!response && !requestPreview) {
    return (
      <div className='dark:bg-zinc-800 py-2 px-4'>
        <Title text='Response' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Fill out the form to see the request details.</p>
      </div>
    )
  }

  return (
    <div className='dark:bg-zinc-800 p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <Title text='Request & Response' />
        {response && (
          <div
            className={`text-xs font-brk uppercase ${
              response.success
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-get'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}>
            {response.success ? 'Success' : 'Error'}
          </div>
        )}
      </div>

      {displayUrl && (
        <div>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide'>
              Request URL
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(displayUrl || '')
                alert('URL copied to clipboard!')
              }}
              className='text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'>
              Copy
            </button>
          </div>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all'>
            <Method method={displayMethod ?? ''} /> {displayUrl}
          </div>
        </div>
      )}

      {displayParams && Object.keys(displayParams).length > 0 && (
        <div>
          <label className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block'>
            Request Parameters
          </label>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto'>
              {JSON.stringify(displayParams, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {displayHeaders && (
        <div>
          <label className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block'>
            Request Headers
          </label>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto'>
              {JSON.stringify(displayHeaders, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {displayBody !== undefined && displayBody !== null && (
        <div>
          <label className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block'>
            Request Body
          </label>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto'>
              {JSON.stringify(displayBody, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {response && (
        <div>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide'>
              Response Data
            </label>
            {responseURL && (
              <a
                href={responseURL}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-number dark:text-number'>
                Open Widget &rarr;
              </a>
            )}
          </div>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-h-96 overflow-auto'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300'>
              {
                (() => {
                  const data = response.data || response.error
                  if (typeof data === 'string') {
                    return data
                  }
                  try {
                    return JSON.stringify(data, null, 2)
                  } catch {
                    return String(data)
                  }
                })() as string
              }
            </pre>
          </div>
        </div>
      )}

      {!response && (
        <div>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 italic'>
            No response yet. Send the request to see the result.
          </p>
        </div>
      )}
    </div>
  )
}
