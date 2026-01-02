'use client'

import { useState } from 'react'
import { decodeAddressIfNeeded } from '../utils/addressEncoding'
import { FormInput } from './shared/FormInput'

interface AffiliateFormProps {
  onSubmit: (address: string, callback: string, affiliateWallet?: string) => void
  loading: boolean
}

export function AffiliateForm({ onSubmit, loading }: AffiliateFormProps) {
  const [address, setAddress] = useState('')
  const [callback, setCallback] = useState('')
  const [affiliateWallet, setAffiliateWallet] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !callback) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(address, decodeAddressIfNeeded(callback), affiliateWallet || undefined)
  }

  return (
    <form onSubmit={handleSubmit} className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold mb-4'>Create Affiliate Wallet</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
        Generate wallet with affiliate commission tracking
      </p>

      <div className='space-y-4'>
        <FormInput
          label='Wallet Address (USDC Polygon)'
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='0xF977814e90dA44bFA03b6295A0616a897441aceC'
          required
          spellCheck={false}
        />

        <FormInput
          label='Callback URL'
          type='text'
          value={callback}
          onChange={(e) => setCallback(e.target.value)}
          placeholder='https://yourdomain.com/api/callback'
          required
        />

        <FormInput
          label='Affiliate Wallet'
          type='text'
          value={affiliateWallet}
          onChange={(e) => setAffiliateWallet(e.target.value)}
          placeholder='Affiliate wallet for commission (0.5% default)'
          helperText='Optional: Affiliate wallet for commission tracking'
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'>
          {loading ? 'Creating...' : 'Create Affiliate Wallet'}
        </button>
      </div>
    </form>
  )
}
