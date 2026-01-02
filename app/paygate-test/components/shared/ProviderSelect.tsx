import type { Provider } from '../../types';

interface ProviderSelectProps {
  providers: Provider[];
  loading: boolean;
  value: string;
  onChange: (providerId: string) => void;
  onProviderChange?: (provider: Provider) => void;
}

export function ProviderSelect({ 
  providers, 
  loading, 
  value, 
  onChange,
  onProviderChange 
}: ProviderSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    onChange(providerId);
    
    if (onProviderChange) {
      const selectedProvider = providers.find(p => p.id === providerId);
      if (selectedProvider) {
        onProviderChange(selectedProvider);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground">
        Loading providers...
      </div>
    );
  }

  const selectedProvider = providers.find(p => p.id === value);

  return (
    <>
      <select
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
        required
      >
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.provider_name} (Min: {provider.minimum_amount} {provider.minimum_currency})
          </option>
        ))}
      </select>
      {selectedProvider && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Minimum: {selectedProvider.minimum_amount} {selectedProvider.minimum_currency}
        </p>
      )}
    </>
  );
}

