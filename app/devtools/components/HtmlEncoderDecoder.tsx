'use client'

import { useState, useTransition } from 'react'

export function HtmlEncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isPending, startTransition] = useTransition()

  const encodeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return text.replace(/[&<>"']/g, (char) => map[char] || char)
  }

  const decodeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/'
    }
    return text.replace(/&(amp|lt|gt|quot|#39|#x27|#x2F);/g, (match) => map[match] || match)
  }

  const handleEncode = () => {
    startTransition(() => {
      try {
        const encoded = encodeHtml(input)
        setOutput(encoded)
      } catch (error) {
        setOutput('Error: Invalid input for encoding')
      }
    })
  }

  const handleDecode = () => {
    startTransition(() => {
      try {
        const decoded = decodeHtml(input)
        setOutput(decoded)
      } catch (error) {
        setOutput('Error: Invalid HTML-encoded string')
      }
    })
  }

  const handleSwap = () => {
    startTransition(() => {
      const temp = input
      setInput(output)
      setOutput(temp)
    })
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className='bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
      <h2 className='text-xl font-semibold mb-4'>HTML Encoder / Decoder</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
        Encode HTML entities (like &lt;, &gt;, &amp;) or decode them back to regular text.
      </p>

      <div className='space-y-4'>
        <div>
          <label htmlFor='html-input' className='block text-sm font-medium mb-2'>
            Input
          </label>
          <textarea
            id='html-input'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter HTML to encode or HTML-encoded string to decode...'
            className='w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm'
          />
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={handleEncode}
            disabled={isPending || !input}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Encode
          </button>
          <button
            onClick={handleDecode}
            disabled={isPending || !input}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Decode
          </button>
          <button
            onClick={handleSwap}
            disabled={isPending || !output}
            className='px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium'>
            Swap
          </button>
          <button
            onClick={handleClear}
            className='px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium'>
            Clear
          </button>
        </div>

        <div>
          <label htmlFor='html-output' className='block text-sm font-medium mb-2'>
            Output
          </label>
          <textarea
            id='html-output'
            value={output}
            readOnly
            placeholder='Result will appear here...'
            className='w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none resize-none font-mono text-sm'
          />
        </div>
      </div>
    </div>
  )
}

