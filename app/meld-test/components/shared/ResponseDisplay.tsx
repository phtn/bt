import type { ApiResponse } from '../../types';

interface ResponseDisplayProps {
  response: ApiResponse | null;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) return null;

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">API Response</h2>
      
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          response.success 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {response.success ? 'Success' : 'Error'}
        </div>
      </div>

      {response.url && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Request URL:</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(response.url || '');
                alert('URL copied to clipboard!');
              }}
              className="text-xs text-primary hover:underline"
            >
              Copy URL
            </button>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg break-all text-sm font-mono">
            {response.url}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Response:</label>
        <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-sm font-mono max-h-96">
          {JSON.stringify(response.data || response.error, null, 2)}
        </pre>
      </div>
    </div>
  );
}

