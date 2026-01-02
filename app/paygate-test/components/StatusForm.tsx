'use client';

import { useState } from 'react';
import { FormInput } from './shared/FormInput';

interface StatusFormProps {
  onSubmit: (address: string, transactionId: string) => void;
  loading: boolean;
}

export function StatusForm({ onSubmit, loading }: StatusFormProps) {
  const [address, setAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !transactionId) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(address, transactionId);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Check Payment Status</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Check the status of a payment transaction
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
          label="Transaction ID"
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Transaction ID from payment"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>
    </form>
  );
}

