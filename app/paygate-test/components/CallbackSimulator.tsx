'use client';

import { useState } from 'react';
import { FormInput } from './shared/FormInput';
import { FormField } from './shared/FormField';

type PaymentStatus = 'paid' | 'success' | 'completed' | 'pending' | 'failed' | 'error' | 'cancelled';

const STATUS_OPTIONS: { value: PaymentStatus; label: string; description: string }[] = [
  { value: 'paid', label: 'Paid', description: 'Payment successful' },
  { value: 'success', label: 'Success', description: 'Payment successful (alternative)' },
  { value: 'completed', label: 'Completed', description: 'Payment completed' },
  { value: 'pending', label: 'Pending', description: 'Payment pending confirmation' },
  { value: 'failed', label: 'Failed', description: 'Payment failed' },
  { value: 'error', label: 'Error', description: 'Payment error occurred' },
  { value: 'cancelled', label: 'Cancelled', description: 'Payment cancelled' },
];

interface CallbackSimulatorProps {
  onSubmit: (params: Record<string, string>) => void;
  loading: boolean;
}

export function CallbackSimulator({ onSubmit, loading }: CallbackSimulatorProps) {
  const [addressIn, setAddressIn] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [ipnToken, setIpnToken] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressIn || !transactionId || !status) {
      alert('Please fill in required fields: address_in, transaction_id, and status');
      return;
    }

    const params: Record<string, string> = {
      address_in: addressIn,
      transaction_id: transactionId,
      status,
    };

    if (amount) params.amount = amount;
    if (currency) params.currency = currency;
    if (ipnToken) params.ipn_token = ipnToken;
    if (callbackUrl) params.callback_url = callbackUrl;

    onSubmit(params);
  };

  const handleQuickFill = (preset: 'success' | 'pending' | 'failed') => {
    setAddressIn('0x1234567890abcdef1234567890abcdef12345678');
    setTransactionId(`tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    setAmount('100.50');
    setCurrency('USD');
    setIpnToken('test_ipn_token_12345');
    setCallbackUrl('https://example.com/api/callback');

    switch (preset) {
      case 'success':
        setStatus('paid');
        break;
      case 'pending':
        setStatus('pending');
        break;
      case 'failed':
        setStatus('failed');
        break;
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Callback Event Simulator</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Simulate PayGate callback events to test your callback endpoint handler
      </p>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handleQuickFill('success')}
          className="px-3 py-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          Quick Fill: Success
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill('pending')}
          className="px-3 py-1.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
        >
          Quick Fill: Pending
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill('failed')}
          className="px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Quick Fill: Failed
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Address In (address_in) *"
          type="text"
          value={addressIn}
          onChange={(e) => setAddressIn(e.target.value)}
          placeholder="Encrypted wallet address from wallet.php"
          required
        />

        <FormInput
          label="Transaction ID (transaction_id) *"
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="tx_1234567890abcdef"
          required
        />

        <FormField label="Status *" required>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground"
            required
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.50"
          />

          <FormInput
            label="Currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </div>

        <FormInput
          label="IPN Token (ipn_token)"
          type="text"
          value={ipnToken}
          onChange={(e) => setIpnToken(e.target.value)}
          placeholder="Token from wallet.php response"
        />

        <FormInput
          label="Callback URL (callback_url)"
          type="url"
          value={callbackUrl}
          onChange={(e) => setCallbackUrl(e.target.value)}
          placeholder="https://example.com/api/callback"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This will send a GET request to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/api/callback</code> with the provided parameters, simulating a real PayGate callback event.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Sending Callback...' : 'Simulate Callback Event'}
        </button>
      </form>
    </div>
  );
}

