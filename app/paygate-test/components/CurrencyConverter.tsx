'use client'

import { useState } from 'react'
import { useCurrencyConversion } from '../hooks/useCurrencyConversion'
import { FormField } from './shared/FormField'
import { FormInput } from './shared/FormInput'

const CURRENCIES = [
  'USD',
  'EUR',
  'CAD',
  'GBP',
  'AUD',
  'JPY',
  'CHF',
  'CNY',
  'INR',
  'BRL',
  'MXN',
  'SGD',
  'HKD',
  'NZD',
  'ZAR',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'TRY',
  'PHP'
]

export function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('EUR')

  const { usdValue, exchangeRate, loading, error } = useCurrencyConversion(amount, fromCurrency)

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold mb-4'>Currency to USD Converter</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
        Convert any currency to USD using PayGate conversion rates
      </p>

      <div className='space-y-4'>
        <FormField label='From Currency' required>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground'>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </FormField>

        <FormInput
          label='Amount'
          type='number'
          step='0.01'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='1258.31'
          required
        />

        {amount && parseFloat(amount) > 0 && (
          <div className='p-6 bg-linear-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 border-2 border-primary/30 dark:border-primary/50 rounded-lg'>
            {loading ? (
              <div className='flex items-center gap-3'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
                <p className='text-gray-600 dark:text-gray-400'>Converting...</p>
              </div>
            ) : error ? (
              <div className='text-red-600 dark:text-red-400'>
                <p className='font-semibold mb-1'>Conversion Error</p>
                <p className='text-sm'>{error.message}</p>
              </div>
            ) : usdValue ? (
              <div>
                <div className='mb-4'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Amount in {fromCurrency}</p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {parseFloat(amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}{' '}
                    {fromCurrency}
                  </p>
                </div>

                <div className='border-t border-gray-300 dark:border-gray-600 pt-4'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Equivalent in USD</p>
                  <p className='text-4xl font-bold text-primary'>
                    $
                    {parseFloat(usdValue).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>

                {exchangeRate && (
                  <div className='mt-4 pt-4 border-t border-gray-300 dark:border-gray-600'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Exchange Rate:{' '}
                      <span className='font-semibold text-gray-700 dark:text-gray-300'>
                        1 {fromCurrency} = {parseFloat(exchangeRate).toFixed(6)} USD
                      </span>
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Enter an amount to see the USD conversion</p>
            )}
          </div>
        )}

        {!amount && (
          <div className='p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
              Enter an amount and select a currency to convert to USD
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
