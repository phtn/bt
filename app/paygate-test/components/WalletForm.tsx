'use client'

import { useState } from 'react'
import { FormInput } from './shared/FormInput'

interface WalletFormProps {
  onSubmit: (address: string, callback: string) => void
  loading: boolean
}

export function WalletForm({ onSubmit, loading }: WalletFormProps) {
  const [address, setAddress] = useState('')
  const [callback, setCallback] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !callback) {
      console.log('Please fill in all required fields')
      return
    }
    onSubmit(address, callback)
  }

  return (
    <form onSubmit={handleSubmit} className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold mb-4'>Create Wallet</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
        Generate a temporary encrypted wallet address for receiving payments
      </p>

      <div className='space-y-4'>
        <FormInput
          label='Wallet Address (USDC Polygon)'
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='0xF977814e90dA44bFA03b6295A0616a897441aceC'
          required
        />

        <FormInput
          label='Callback URL'
          type='url'
          value={callback}
          onChange={(e) => setCallback(e.target.value)}
          placeholder='https://yourdomain.com/api/callback'
          required
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'>
          {loading ? 'Loading...' : 'Create Wallet'}
        </button>
      </div>
    </form>
  )
}
