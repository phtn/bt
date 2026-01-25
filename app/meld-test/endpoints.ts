export interface EndpointParam {
  name: string
  type: string
  required: boolean
  description?: string
  examples: string[]
}

export interface EndpointConfig {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  params?: EndpointParam[]
  bodySchema?: Record<string, unknown>
}

export const meldEndpoints: EndpointConfig[] = [
  {
    id: 'health',
    name: 'Health Check',
    method: 'GET',
    path: '/v1/health',
    description: 'Check the health status of the Meld API',
    params: []
  },
  {
    id: 'config',
    name: 'Get Config',
    method: 'GET',
    path: '/v1/config',
    description: 'Retrieve configuration information from the Meld API',
    params: []
  },
  {
    id: 'quote',
    name: 'Get Crypto Quote',
    method: 'POST',
    path: '/payments/crypto/quote',
    description: 'Get a quote for buying cryptocurrency',
    params: [
      {
        name: 'countryCode',
        type: 'string',
        required: true,
        description: 'Country code (auto-detected)',
        examples: ['US', 'GB', 'CA', 'AU', 'PH']
      },
      {
        name: 'sourceCurrencyCode',
        type: 'string',
        required: true,
        description: 'Source currency code (e.g., USD, EUR)',
        examples: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
      },
      {
        name: 'destinationCurrencyCode',
        type: 'string',
        required: true,
        description: 'Destination cryptocurrency code (e.g., USDC, ETH)',
        examples: ['USDC', 'ETH', 'BTC', 'USDT', 'MATIC']
      },
      {
        name: 'sourceAmount',
        type: 'number',
        required: false,
        description: 'Source amount to convert',
        examples: ['100', '500', '1000', '2500', '5000']
      },
      {
        name: 'destinationAmount',
        type: 'number',
        required: false,
        description: 'Destination amount to receive',
        examples: ['100', '500', '1000', '2500', '5000']
      }
    ],
    bodySchema: {
      countryCode: 'string',
      sourceCurrencyCode: 'string',
      destinationCurrencyCode: 'string',
      sourceAmount: 'number (optional)',
      destinationAmount: 'number (optional)'
    }
  },
  {
    id: 'session',
    name: 'Create Session',
    method: 'POST',
    path: '/v1/session',
    description: 'Create a new session for a transaction',
    params: [
      {
        name: 'externalCustomerId',
        type: 'string',
        required: true,
        description: 'External customer identifier',
        examples: ['customer-001', 'user-12345', 'client-abc', 'user-xyz', 'customer-999']
      },
      {
        name: 'walletAddress',
        type: 'string',
        required: true,
        description: 'Destination wallet address',
        examples: [
          '0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2',
          '0xF977814e90dA44bFA03b6295A0616a897441aceC',
          '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          '0x8ba1f109551bD432803012645Hac136c22C1779',
          '0x1234567890123456789012345678901234567890'
        ]
      },
      {
        name: 'destinationCurrencyCode',
        type: 'string',
        required: true,
        description: 'Destination cryptocurrency code',
        examples: ['USDC', 'ETH', 'BTC', 'USDT', 'MATIC']
      }
    ],
    bodySchema: {
      externalCustomerId: 'string',
      walletAddress: 'string',
      destinationCurrencyCode: 'string'
    }
  },
  {
    id: 'session-quote',
    name: 'Get Session Quote',
    method: 'POST',
    path: '/v1/session/quote',
    description: 'Get a quote for a specific session',
    params: [
      {
        name: 'sessionId',
        type: 'string',
        required: true,
        description: 'Session identifier',
        examples: ['session-001', 'sess-12345', 'session-abc', 'sess-xyz', 'session-999']
      },
      {
        name: 'sourceAmount',
        type: 'number',
        required: false,
        description: 'Source amount',
        examples: ['100', '500', '1000', '2500', '5000']
      },
      {
        name: 'destinationAmount',
        type: 'number',
        required: false,
        description: 'Destination amount',
        examples: ['100', '500', '1000', '2500', '5000']
      }
    ],
    bodySchema: {
      sessionId: 'string',
      sourceAmount: 'number (optional)',
      destinationAmount: 'number (optional)'
    }
  },
  {
    id: 'session-status',
    name: 'Get Session Status',
    method: 'GET',
    path: '/v1/session/{sessionId}',
    description: 'Get the status of a specific session',
    params: [
      {
        name: 'sessionId',
        type: 'string',
        required: true,
        description: 'Session identifier',
        examples: ['session-001', 'sess-12345', 'session-abc', 'sess-xyz', 'session-999']
      }
    ]
  },
  {
    id: 'transactions',
    name: 'List Transactions',
    method: 'GET',
    path: '/v1/transactions',
    description: 'List all transactions',
    params: [
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of results to return',
        examples: ['10', '25', '50', '100', '200']
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        description: 'Number of results to skip',
        examples: ['0', '10', '25', '50', '100']
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Filter by transaction status',
        examples: ['pending', 'completed', 'failed', 'cancelled', 'processing']
      }
    ]
  },
  {
    id: 'transaction',
    name: 'Get Transaction',
    method: 'GET',
    path: '/v1/transactions/{transactionId}',
    description: 'Get details of a specific transaction',
    params: [
      {
        name: 'transactionId',
        type: 'string',
        required: true,
        description: 'Transaction identifier',
        examples: ['txn-001', 'tx-12345', 'transaction-abc', 'tx-xyz', 'txn-999']
      }
    ]
  },
  {
    id: 'webhooks',
    name: 'List Webhooks',
    method: 'GET',
    path: '/v1/webhooks',
    description: 'List all configured webhooks',
    params: []
  },
  {
    id: 'webhook',
    name: 'Create Webhook',
    method: 'POST',
    path: '/v1/webhooks',
    description: 'Create a new webhook',
    params: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'Webhook URL',
        examples: [
          'https://example.com/webhook',
          'https://api.example.com/meld/webhook',
          'https://webhook.site/unique-id',
          'https://myapp.com/api/meld/callback',
          'https://localhost:3000/api/webhooks/meld'
        ]
      },
      {
        name: 'events',
        type: 'array',
        required: true,
        description: 'Events to subscribe to',
        examples: [
          'transaction.completed',
          'transaction.failed',
          'session.created',
          'quote.updated',
          'payment.received'
        ]
      }
    ],
    bodySchema: {
      url: 'string',
      events: 'array<string>'
    }
  }
]

export function getEndpointById(id: string): EndpointConfig | undefined {
  return meldEndpoints.find((endpoint) => endpoint.id === id)
}
