/**
 * PayGate Callback Types
 * 
 * Type definitions for PayGate callback endpoint parameters
 */

export interface PayGateCallbackParams {
  /** Encrypted wallet address from wallet.php response */
  address_in: string;
  
  /** Unique transaction identifier */
  transaction_id?: string;
  txid?: string;
  id?: string;
  
  /** Payment status: paid, pending, failed, success, completed, error, cancelled */
  status: string;
  
  /** Payment amount */
  amount?: string;
  
  /** Currency code (USD, EUR, CAD, etc.) */
  currency?: string;
  
  /** IPN token for validation (from wallet.php response) */
  ipn_token?: string;
  
  /** Original callback URL */
  callback_url?: string;
  
  /** Additional parameters that may be sent by PayGate */
  [key: string]: string | undefined;
}

export interface PayGateCallbackResponse {
  success: boolean;
  message: string;
  transactionId?: string | null;
  error?: string;
}

export interface ProcessedPaymentData {
  addressIn: string | null;
  transactionId: string | null;
  status: string | null;
  amount: number | null;
  currency: string | null;
  ipnToken: string | null;
  callbackUrl: string | null;
  timestamp: string;
}

export type PaymentStatus = 
  | 'paid' 
  | 'success' 
  | 'completed' 
  | 'pending' 
  | 'failed' 
  | 'error' 
  | 'cancelled';

