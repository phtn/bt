export type EndpointType = 'wallet' | 'process-payment' | 'status' | 'create' | 'affiliate' | 'hosted-payment' | 'currency-converter' | 'callback-simulator';

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  url?: string;
}

export interface Provider {
  id: string;
  provider_name: string;
  status: 'active' | 'inactive' | 'redirected' | 'unstable';
  minimum_currency: string;
  minimum_amount: number;
}

export interface ProviderStatusResponse {
  providers: Provider[];
}

