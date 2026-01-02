import type { ApiResponse } from '../types';

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
        {response.data && 
         typeof response.data === 'object' && 
         'type' in response.data && 
         response.data.type === 'html' &&
         'message' in response.data &&
         'content' in response.data ? (
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
              <p className="mb-2">{String(response.data.message)}</p>
              <a
                href={response.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open Checkout Page in New Tab →
              </a>
            </div>
            <details className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <summary className="cursor-pointer font-medium text-sm mb-2">View HTML Source</summary>
              <pre className="mt-2 overflow-auto text-xs font-mono max-h-96">
                {String(response.data.content)}
              </pre>
            </details>
          </div>
        ) : (
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-sm font-mono max-h-96">
            {JSON.stringify(response.data || response.error, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

