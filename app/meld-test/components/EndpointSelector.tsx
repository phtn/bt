'use client'

import { useState } from 'react'
import { meldEndpoints } from '../endpoints'

interface EndpointSelectorProps {
  selectedEndpoint: string
  onSelect: (endpointId: string) => void
}

export function EndpointSelector({ selectedEndpoint, onSelect }: EndpointSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEndpoints = meldEndpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2'>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search endpoints...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full px-1 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600'
        />
      </div>
      <div className='space-y-1 max-h-160 overflow-y-auto'>
        {filteredEndpoints.map((endpoint) => (
          <button
            key={endpoint.id}
            onClick={() => onSelect(endpoint.id)}
            className={`w-full text-left py-2 text-sm transition-colors ${
              selectedEndpoint === endpoint.id
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950'
            }`}>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-mono px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'>
                {endpoint.method}
              </span>
              <span className='font-medium'>{endpoint.name}</span>
            </div>
            <div className='text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 truncate'>{endpoint.path}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
