'use client';

import { useState } from 'react';
import { FormInput } from './shared/FormInput';
import { FormField } from './shared/FormField';
import type { MeldEnvironment } from '../types';

interface GenericEndpointFormProps {
  onSubmit: (endpoint: string, apiKey: string, environment: MeldEnvironment, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: string) => void;
  loading: boolean;
}

export function GenericEndpointForm({ onSubmit, loading }: GenericEndpointFormProps) {
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState<MeldEnvironment>('sandbox');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!endpoint || !apiKey) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(endpoint, apiKey, environment, method, body || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Generic Endpoint</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test any Meld API endpoint with custom parameters
      </p>
      
      <div className="space-y-4">
        <FormField label="API Key" required>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Meld API Key"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Your API key will be used in the Authorization header as BASIC {`{apiKey}`}
          </p>
        </FormField>

        <FormField label="Environment" required>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as MeldEnvironment)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
            required
          >
            <option value="sandbox">Sandbox (api-sb.meld.io)</option>
            <option value="production">Production (api.meld.io)</option>
          </select>
        </FormField>

        <FormField label="HTTP Method" required>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
            required
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </FormField>

        <FormInput
          label="Endpoint"
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/v1/health or /v1/config"
          required
          helperText="Enter the endpoint path (e.g., /v1/health)"
        />

        {(method === 'POST' || method === 'PUT') && (
          <FormField label="Request Body (JSON)" helperText="Optional JSON body for POST/PUT requests">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground font-mono text-sm"
            />
          </FormField>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Loading...' : 'Make Request'}
        </button>
      </div>
    </form>
  );
}

