'use client'

import { useState } from 'react'
import { AffiliateForm } from './components/AffiliateForm'
import { CallbackSimulator } from './components/CallbackSimulator'
import { CreatePaymentForm } from './components/CreatePaymentForm'
import { CurrencyConverter } from './components/CurrencyConverter'
import { HostedPaymentForm } from './components/HostedPaymentForm'
import { ProcessPaymentForm } from './components/ProcessPaymentForm'
import { ResponseDisplay } from './components/ResponseDisplay'
import { StatusForm } from './components/StatusForm'
import { TabNavigation } from './components/TabNavigation'
import { WalletForm } from './components/WalletForm'
import { useApiCall } from './hooks/useApiCall'
import { useProviders } from './hooks/useProviders'
import type { EndpointType } from './types'
import { decodeAddressIfNeeded } from './utils/addressEncoding'

export const PayGateContent = () => {
  const [activeTab, setActiveTab] = useState<EndpointType>('wallet')
  const { providers, loading: loadingProviders } = useProviders()
  const { loading, response, handleApiCall } = useApiCall()

  // Handlers for each form
  const handleWalletSubmit = (address: string, callback: string) => {
    const encodedCallback = encodeURIComponent(encodeURIComponent(callback))
    const url = `https://api.paygate.to/control/wallet.php?address=${address}&callback=${encodedCallback}`
    handleApiCall(url)
  }

  const handleProcessPaymentSubmit = (
    address: string,
    amount: string,
    provider: string,
    email: string,
    currency: string
  ) => {
    const addressToUse = decodeAddressIfNeeded(address)
    const params = new URLSearchParams()
    params.append('address', addressToUse)
    params.append('amount', amount)
    params.append('provider', provider)
    params.append('email', email)
    params.append('currency', currency)
    const url = `https://checkout.paygate.to/process-payment.php?${params.toString()}`
    handleApiCall(url)
  }

  const handleHostedPaymentSubmit = (
    address: string,
    amount: string,
    email: string,
    currency: string,
    whiteLabel?: {
      domain?: string
      logo?: string
      background?: string
      theme?: string
      button?: string
    }
  ) => {
    const addressToUse = decodeAddressIfNeeded(address)
    const params = new URLSearchParams()
    params.append('address', addressToUse)
    params.append('amount', amount)
    params.append('provider', 'hosted')
    params.append('email', email)
    params.append('currency', currency)

    // Add white label parameters if provided
    if (whiteLabel) {
      if (whiteLabel.domain) params.append('domain', whiteLabel.domain)
      if (whiteLabel.logo) params.append('logo', encodeURIComponent(whiteLabel.logo))
      if (whiteLabel.background) params.append('background', encodeURIComponent(whiteLabel.background))
      if (whiteLabel.theme) params.append('theme', encodeURIComponent(whiteLabel.theme))
      if (whiteLabel.button) params.append('button', encodeURIComponent(whiteLabel.button))
    }

    const url = `https://checkout.paygate.to/pay.php?${params.toString()}`
    handleApiCall(url)
  }

  const handleStatusSubmit = (address: string, transactionId: string) => {
    const addressToUse = decodeAddressIfNeeded(address)
    const params = new URLSearchParams()
    params.append('address_in', addressToUse)
    params.append('transaction_id', transactionId)
    const url = `https://api.paygate.to/status.php?${params.toString()}`
    handleApiCall(url)
  }

  const handleCreateSubmit = (address: string, amount: string, provider: string, email: string, currency: string) => {
    const addressToUse = decodeAddressIfNeeded(address)
    const params = new URLSearchParams()
    params.append('address', addressToUse)
    params.append('amount', amount)
    params.append('provider', provider)
    params.append('email', email)
    params.append('currency', currency)
    const url = `https://api.paygate.to/create.php?${params.toString()}`
    handleApiCall(url)
  }

  const handleAffiliateSubmit = (address: string, callback: string, affiliateWallet?: string) => {
    const encodedCallback = encodeURIComponent(encodeURIComponent(callback))
    const params = new URLSearchParams({
      address,
      callback: encodedCallback
    })
    if (affiliateWallet) {
      params.append('affiliate', affiliateWallet)
    }
    const url = `https://api.paygate.to/control/affiliate.php?${params.toString()}`
    handleApiCall(url)
  }

  const handleCallbackSimulatorSubmit = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    const url = `/api/callback?${searchParams.toString()}`
    handleApiCall(url)
  }

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-screen mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold mb-2 space-x-2 tracking-tighter'>
            <span>PayGate</span> <span className='font-normal opacity-70'>api-tester</span>
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>Test-stand for PayGate api endpoints</p>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Forms */}
          <div className='space-y-6'>
            {activeTab === 'wallet' && <WalletForm onSubmit={handleWalletSubmit} loading={loading} />}

            {activeTab === 'process-payment' && (
              <ProcessPaymentForm
                providers={providers}
                loadingProviders={loadingProviders}
                onSubmit={handleProcessPaymentSubmit}
                loading={loading}
              />
            )}

            {activeTab === 'hosted-payment' && (
              <HostedPaymentForm
                providers={providers}
                loadingProviders={loadingProviders}
                onSubmit={handleHostedPaymentSubmit}
                loading={loading}
              />
            )}

            {activeTab === 'status' && <StatusForm onSubmit={handleStatusSubmit} loading={loading} />}

            {activeTab === 'create' && (
              <CreatePaymentForm
                providers={providers}
                loadingProviders={loadingProviders}
                onSubmit={handleCreateSubmit}
                loading={loading}
              />
            )}

            {activeTab === 'affiliate' && <AffiliateForm onSubmit={handleAffiliateSubmit} loading={loading} />}

            {activeTab === 'currency-converter' && <CurrencyConverter />}

            {activeTab === 'callback-simulator' && (
              <CallbackSimulator onSubmit={handleCallbackSimulatorSubmit} loading={loading} />
            )}
          </div>

          {/* Response Display */}
          <div className='space-y-6'>
            <ResponseDisplay response={response} />

            {/* Info Box */}
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg'>
              <h3 className='font-semibold mb-2'>📚 Documentation</h3>
              <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>For detailed API documentation, visit:</p>
              <a
                href='https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 dark:text-blue-400 hover:underline text-sm'>
                PayGate.to API Documentation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
