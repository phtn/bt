'use client';

import { useState } from 'react';
import { FormField } from './shared/FormField';
import type { MeldEnvironment } from '../types';

interface HealthCheckFormProps {
  onSubmit: (apiKey: string, environment: MeldEnvironment) => void;
  loading: boolean;
}

export function HealthCheckForm({ onSubmit, loading }: HealthCheckFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState<MeldEnvironment>('sandbox');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }
    onSubmit(apiKey, environment);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Health Check</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test the health endpoint to verify API connectivity
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Loading...' : 'Check Health'}
        </button>
      </div>
    </form>
  );
}

