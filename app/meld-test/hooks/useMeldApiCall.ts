import { useState, useRef, useCallback } from 'react'
import type { ApiResponse, MeldEnvironment } from '../types'

export function useMeldApiCall() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getBaseUrl = (environment: MeldEnvironment): string => {
    return environment === 'sandbox' ? 'https://api-sb.meld.io' : 'https://api.meld.io'
  }

  const handleApiCall = useCallback(
    async (
      endpoint: string,
      apiKey: string,
      environment: MeldEnvironment,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: unknown,
      params?: Record<string, string>
    ) => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new AbortController for this request
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setLoading(true)
      setResponse(null)

      try {
        const baseUrl = getBaseUrl(environment)
        let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

        // Add query parameters for GET requests
        if (params && method === 'GET' && Object.keys(params).length > 0) {
          const queryString = new URLSearchParams(params).toString()
          url = `${url}?${queryString}`
        }

        // Replace path parameters
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`{${key}}`, value)
          })
        }

        const headers: HeadersInit = {
          Authorization: `BASIC ${apiKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }

        const fetchOptions: RequestInit = {
          method,
          headers,
          signal: abortController.signal
        }

        if (body && (method === 'POST' || method === 'PUT')) {
          fetchOptions.body = JSON.stringify(body)
        }

        const response = await fetch(url, fetchOptions)

        if (abortController.signal.aborted) {
          return
        }

        const contentType = response.headers.get('content-type') || ''
        let data: unknown

        if (contentType.includes('application/json')) {
          data = await response.json()
        } else {
          data = await response.text()
        }

        if (!abortController.signal.aborted) {
          setResponse({
            success: response.ok,
            data,
            url,
            method,
            headers: {
              Authorization: `BASIC ${apiKey.substring(0, 10)}...`,
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: body || undefined,
            params: params || undefined
          })
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError' && !abortController.signal.aborted) {
          setResponse({
            success: false,
            error: error.message,
            url: `${getBaseUrl(environment)}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
            method,
            params: params || undefined
          })
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    },
    []
  )

  return { loading, response, handleApiCall }
}

