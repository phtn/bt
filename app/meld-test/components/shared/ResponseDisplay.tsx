import type { ApiResponse } from '../../types'

interface ResponseDisplayProps {
  response: ApiResponse | null
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-sm font-medium mb-4 text-zinc-900 dark:text-zinc-100">Response</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">No response yet. Make a request to see the result.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Response</h3>
        <div
          className={`px-2 py-1 text-xs font-medium ${
            response.success
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}>
          {response.success ? 'Success' : 'Error'}
        </div>
      </div>

      {response.url && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Request URL
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(response.url || '')
                alert('URL copied to clipboard!')
              }}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
              Copy
            </button>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all">
            {response.method} {response.url}
          </div>
        </div>
      )}

      {response.params && Object.keys(response.params).length > 0 && (
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block">
            Request Parameters
          </label>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto">
              {JSON.stringify(response.params, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {response.headers && (
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block">
            Request Headers
          </label>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto">
              {JSON.stringify(response.headers, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {response.body !== undefined && response.body !== null && (
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block">
            Request Body
          </label>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto">
              {JSON.stringify(response.body, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 block">
          Response Data
        </label>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-h-96 overflow-auto">
          <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
            {(() => {
              const data = response.data || response.error
              if (typeof data === 'string') {
                return data
              }
              try {
                return JSON.stringify(data, null, 2)
              } catch {
                return String(data)
              }
            })() as string}
          </pre>
        </div>
      </div>
    </div>
  )
}
