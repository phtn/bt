'use client';

import { useState } from 'react';
import type { Provider } from '../types';
import { FormInput } from './shared/FormInput';
import { FormField } from './shared/FormField';
import { CurrencySelect } from './shared/CurrencySelect';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';

interface WhiteLabelParams {
  domain?: string;
  logo?: string;
  background?: string;
  theme?: string;
  button?: string;
}

interface HostedPaymentFormProps {
  providers: Provider[];
  loadingProviders: boolean;
  onSubmit: (
    address: string,
    amount: string,
    email: string,
    currency: string,
    whiteLabel?: WhiteLabelParams
  ) => void;
  loading: boolean;
}

export function HostedPaymentForm({ 
  providers, 
  loadingProviders, 
  onSubmit, 
  loading 
}: HostedPaymentFormProps) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showWhiteLabel, setShowWhiteLabel] = useState(false);
  
  // White label parameters
  const [domain, setDomain] = useState('');
  const [logo, setLogo] = useState('');
  const [background, setBackground] = useState('');
  const [theme, setTheme] = useState('');
  const [button, setButton] = useState('');
  
  // Get USD conversion when currency is not USD
  const { usdValue, exchangeRate, loading: converting } = useCurrencyConversion(amount, currency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !amount || !email || !currency) {
      alert('Please fill in all required fields');
      return;
    }
    
    const whiteLabel: WhiteLabelParams = {};
    if (domain) whiteLabel.domain = domain;
    if (logo) whiteLabel.logo = logo;
    if (background) whiteLabel.background = background;
    if (theme) whiteLabel.theme = theme;
    if (button) whiteLabel.button = button;
    
    const hasWhiteLabel = Object.keys(whiteLabel).length > 0;
    onSubmit(address, amount, email, currency, hasWhiteLabel ? whiteLabel : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Hosted Payment Page</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Create a hosted payment page where customers can select from multiple payment providers
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
          placeholder="200"
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

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          required
        />

        <FormField label="Currency" required>
          <CurrencySelect
            providers={providers}
            loading={loadingProviders}
            value={currency}
            onChange={setCurrency}
          />
        </FormField>

        {/* White Label Options */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => setShowWhiteLabel(!showWhiteLabel)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <span className="font-semibold text-gray-900 dark:text-white">
              White Label Options (Optional)
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {showWhiteLabel ? '▼' : '▶'}
            </span>
          </button>

          {showWhiteLabel && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <FormInput
                label="Custom Domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="payment.yourdomain.com"
                helperText="Your custom domain for white-labeling (e.g., payment.yourdomain.com)"
              />

              <FormInput
                label="Logo URL"
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                helperText="URL-encoded logo image URL for your brand"
              />

              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Background Color"
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#e7ebf3 or white"
                  helperText="HEX color or CSS name"
                />

                <FormInput
                  label="Theme Color"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="#1778F2"
                  helperText="HEX color or CSS name"
                />

                <FormInput
                  label="Button Color"
                  type="text"
                  value={button}
                  onChange={(e) => setButton(e.target.value)}
                  placeholder="#1459B1"
                  helperText="HEX color or CSS name"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> Colors can be HEX values (e.g., #1778F2) or CSS color names (e.g., blue, white). 
                  Logo URL should be URL-encoded if it contains special characters.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This endpoint uses <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">provider=hosted</code> which displays a page where customers can select from multiple available payment providers.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Loading...' : 'Open Hosted Payment Page'}
        </button>
      </div>
    </form>
  );
}

