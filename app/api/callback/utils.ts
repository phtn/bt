/**
 * PayGate Callback Utilities
 * 
 * Helper functions for processing PayGate callbacks
 */

import type { ProcessedPaymentData } from './types';

/**
 * Extract transaction ID from various possible parameter names
 */
export function extractTransactionId(searchParams: URLSearchParams): string | null {
  return (
    searchParams.get('transaction_id') ||
    searchParams.get('txid') ||
    searchParams.get('id') ||
    searchParams.get('payment_id') ||
    null
  );
}

/**
 * Normalize payment status to standard format
 */
export function normalizePaymentStatus(status: string | null): string {
  if (!status) return 'unknown';
  
  const normalized = status.toLowerCase().trim();
  
  // Map various status formats to standard values
  const statusMap: Record<string, string> = {
    'paid': 'paid',
    'success': 'paid',
    'completed': 'paid',
    'complete': 'paid',
    'pending': 'pending',
    'processing': 'pending',
    'failed': 'failed',
    'error': 'failed',
    'cancelled': 'failed',
    'canceled': 'failed',
    'declined': 'failed',
    'rejected': 'failed',
  };
  
  return statusMap[normalized] || normalized;
}

/**
 * Validate IPN token (if needed)
 * 
 * TODO: Implement actual validation logic based on PayGate requirements
 * This may involve:
 * - Comparing with stored token from wallet.php response
 * - Verifying token signature
 * - Checking token expiration
 */
export async function validateIpnToken(
  token: string,
  addressIn: string
): Promise<boolean> {
  // TODO: Implement IPN token validation
  // For now, return true to allow processing
  // In production, implement proper validation
  
  if (!token || !addressIn) {
    return false;
  }
  
  // Example validation logic:
  // 1. Retrieve stored token from database using addressIn
  // 2. Compare tokens
  // 3. Check token expiration
  // 4. Verify signature if applicable
  
  return true;
}

/**
 * Parse amount string to number
 */
export function parseAmount(amount: string | null): number | null {
  if (!amount) return null;
  
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Create processed payment data object
 */
export function createPaymentData(
  searchParams: URLSearchParams
): ProcessedPaymentData {
  const addressIn = searchParams.get('address_in');
  const transactionId = extractTransactionId(searchParams);
  const status = normalizePaymentStatus(searchParams.get('status'));
  const amount = parseAmount(searchParams.get('amount'));
  const currency = searchParams.get('currency');
  const ipnToken = searchParams.get('ipn_token');
  const callbackUrl = searchParams.get('callback_url');
  
  return {
    addressIn,
    transactionId,
    status,
    amount,
    currency,
    ipnToken,
    callbackUrl,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Log callback for debugging and auditing
 */
export function logCallback(
  paymentData: ProcessedPaymentData,
  allParams: Record<string, string>
): void {
  // In production, use proper logging service
  console.log('[PayGate Callback]', {
    transactionId: paymentData.transactionId,
    status: paymentData.status,
    amount: paymentData.amount,
    currency: paymentData.currency,
    timestamp: paymentData.timestamp,
    // Don't log sensitive data in production
    // addressIn: paymentData.addressIn,
    // ipnToken: paymentData.ipnToken,
    allParams,
  });
}

