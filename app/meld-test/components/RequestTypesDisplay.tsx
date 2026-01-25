'use client'

import type { EndpointConfig } from '../endpoints'

interface RequestTypesDisplayProps {
  endpoint: EndpointConfig | undefined
}

export function RequestTypesDisplay({ endpoint }: RequestTypesDisplayProps) {
  if (!endpoint) {
    return (
      <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6'>
        <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4'>Request Types</h3>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Select an endpoint to view request types</p>
      </div>
    )
  }

  return (
    <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-6'>
      <div>
        <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4'>Request Parameters</h3>
        {endpoint.params && endpoint.params.length > 0 ? (
          <div className='space-y-3'>
            {endpoint.params.map((param) => (
              <div key={param.name} className='border-b border-zinc-200 dark:border-zinc-800 pb-3 last:border-0'>
                <div className='flex items-start justify-between mb-1'>
                  <span className='text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100'>{param.name}</span>
                  <span className='text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'>
                    {param.type}
                  </span>
                </div>
                {param.required && (
                  <span className='text-xs text-zinc-500 dark:text-zinc-500'>Required</span>
                )}
                {param.description && (
                  <p className='text-xs text-zinc-500 dark:text-zinc-500 mt-1'>{param.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>No parameters required</p>
        )}
      </div>

      {endpoint.bodySchema && (
        <div>
          <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4'>Request Body Schema</h3>
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto'>
              {JSON.stringify(endpoint.bodySchema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
