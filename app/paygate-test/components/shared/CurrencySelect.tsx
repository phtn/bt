import type { Provider } from '../../types';

interface CurrencySelectProps {
  providers: Provider[];
  loading: boolean;
  value: string;
  onChange: (currency: string) => void;
  selectedProviderId?: string;
}

export function CurrencySelect({ 
  providers, 
  loading, 
  value, 
  onChange,
  selectedProviderId 
}: CurrencySelectProps) {
  const getAvailableCurrencies = (): string[] => {
    if (loading || providers.length === 0) {
      return ['USD', 'EUR', 'CAD', 'INR'];
    }

    const allCurrencies = providers
      .map(p => p.minimum_currency)
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .sort();
    
    return allCurrencies;
  };

  const currencies = getAvailableCurrencies();
  const selectedProvider = selectedProviderId 
    ? providers.find(p => p.id === selectedProviderId)
    : null;

  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
        required
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      {selectedProvider && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Required currency: {selectedProvider.minimum_currency}
        </p>
      )}
    </>
  );
}

