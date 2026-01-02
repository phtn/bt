'use client';

import { useState, useEffect } from 'react';
import type { Provider } from '../types';
import { FormInput } from './shared/FormInput';
import { FormField } from './shared/FormField';
import { ProviderSelect } from './shared/ProviderSelect';
import { CurrencySelect } from './shared/CurrencySelect';
import { decodeAddressIfNeeded } from '../utils/addressEncoding';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';

interface ProcessPaymentFormProps {
  providers: Provider[];
  loadingProviders: boolean;
  onSubmit: (address: string, amount: string, provider: string, email: string, currency: string) => void;
  loading: boolean;
}

export function ProcessPaymentForm({ 
  providers, 
  loadingProviders, 
  onSubmit, 
  loading 
}: ProcessPaymentFormProps) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  // Get USD conversion when currency is not USD
  const { usdValue, exchangeRate, loading: converting } = useCurrencyConversion(amount, currency);

  // Set default provider when providers load
  useEffect(() => {
    if (providers.length > 0 && !provider) {
      const firstProvider = providers[0];
      setProvider(firstProvider.id);
      setCurrency(firstProvider.minimum_currency);
    }
  }, [providers, provider]);

  const handleProviderChange = (selectedProvider: Provider) => {
    setCurrency(selectedProvider.minimum_currency);
    // Update amount if it's below minimum
    if (parseFloat(amount) < selectedProvider.minimum_amount) {
      setAmount(selectedProvider.minimum_amount.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount || !provider || !email || !currency) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(address, amount, provider, email, currency);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Process Payment</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Redirect customer to payment page (returns HTML checkout page)
      </p>
      
      <div className="space-y-4">
        <FormInput
          label="Encrypted Address (address_in)"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="From wallet.php response"
          required
        />

        <FormInput
          label="Amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="105.75"
          required
        />
        
        {currency !== 'USD' && amount && parseFloat(amount) > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {converting ? (
                <span>Converting to USD...</span>
              ) : usdValue ? (
                <>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ≈ ${parseFloat(usdValue).toFixed(2)} USD
                  </span>
                  {exchangeRate && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      (Rate: {parseFloat(exchangeRate).toFixed(4)})
                    </span>
                  )}
                </>
              ) : null}
            </p>
          </div>
        )}

        <FormField label="Provider" required>
          <ProviderSelect
            providers={providers}
            loading={loadingProviders}
            value={provider}
            onChange={setProvider}
            onProviderChange={handleProviderChange}
          />
        </FormField>

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />

        <FormField label="Currency" required>
          <CurrencySelect
            providers={providers}
            loading={loadingProviders}
            value={currency}
            onChange={setCurrency}
            selectedProviderId={provider}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Processing...' : 'Process Payment'}
        </button>
      </div>
    </form>
  );
}

