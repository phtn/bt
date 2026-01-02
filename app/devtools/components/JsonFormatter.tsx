'use client'

import { useState, useTransition } from 'react'

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleFormat = () => {
    startTransition(() => {
      try {
        const parsed = JSON.parse(input)
        const formatted = JSON.stringify(parsed, null, 2)
        setOutput(formatted)
        setError('')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
        setError(`Error: ${errorMessage}`)
        setOutput('')
      }
    })
  }

  const handleMinify = () => {
    startTransition(() => {
      try {
        const parsed = JSON.parse(input)
        const minified = JSON.stringify(parsed)
        setOutput(minified)
        setError('')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
        setError(`Error: ${errorMessage}`)
        setOutput('')
      }
    })
  }

  const handleValidate = () => {
    startTransition(() => {
      try {
        JSON.parse(input)
        setError('')
        setOutput('✓ Valid JSON')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Invalid JSON'
        setError(`Error: ${errorMessage}`)
        setOutput('')
      }
    })
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className='bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
      <h2 className='text-xl font-semibold mb-4'>JSON Formatter</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
        Format, minify, or validate JSON strings.
      </p>

      <div className='space-y-4'>
        <div>
          <label htmlFor='json-input' className='block text-sm font-medium mb-2'>
            Input
          </label>
          <textarea
            id='json-input'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON string...'
            className='w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm'
          />
        </div>

        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
            {error}
          </div>
        )}

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={handleFormat}
            disabled={isPending || !input}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Format
          </button>
          <button
            onClick={handleMinify}
            disabled={isPending || !input}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Minify
          </button>
          <button
            onClick={handleValidate}
            disabled={isPending || !input}
            className='px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Validate
          </button>
          <button
            onClick={handleClear}
            className='px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium'>
            Clear
          </button>
        </div>

        <div>
          <label htmlFor='json-output' className='block text-sm font-medium mb-2'>
            Output
          </label>
          <textarea
            id='json-output'
            value={output}
            readOnly
            placeholder='Formatted JSON will appear here...'
            className='w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none resize-none font-mono text-sm'
          />
        </div>
      </div>
    </div>
  )
}

