import { NextRequest, NextResponse } from 'next/server';
import type { ProcessedPaymentData } from './types';
import {
  extractTransactionId,
  normalizePaymentStatus,
  validateIpnToken,
  createPaymentData,
  logCallback,
} from './utils';

/**
 * PayGate Callback GET Endpoint
 * 
 * This endpoint receives payment notifications from PayGate.to
 * PayGate will send GET requests to this callback URL with payment information
 * 
 * Expected query parameters:
 * - address_in: Encrypted wallet address
 * - transaction_id: Unique transaction identifier
 * - status: Payment status (paid, pending, failed, etc.)
 * - amount: Payment amount
 * - currency: Currency code (USD, EUR, CAD, etc.)
 * - ipn_token: IPN token for validation (from wallet.php response)
 * - Additional parameters as per PayGate documentation
 * 
 * @see https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#9f7c5d95-9ca3-495a-931a-128d76ecd92e
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Create processed payment data using utility functions
    const paymentData = createPaymentData(searchParams);

    // Log the callback for debugging and auditing
    logCallback(paymentData, Object.fromEntries(searchParams.entries()));

    // Validate required parameters
    if (!paymentData.addressIn) {
      return NextResponse.json(
        { error: 'Missing required parameter: address_in' },
        { status: 400 }
      );
    }

    if (!paymentData.transactionId) {
      return NextResponse.json(
        { error: 'Missing required parameter: transaction_id (or txid/id)' },
        { status: 400 }
      );
    }

    if (!paymentData.status || paymentData.status === 'unknown') {
      return NextResponse.json(
        { error: 'Missing or invalid required parameter: status' },
        { status: 400 }
      );
    }

    // Validate IPN token if provided
    // Compare ipnToken with the token received from wallet.php response
    // This helps ensure the callback is legitimate
    if (paymentData.ipnToken && paymentData.addressIn) {
      const isValidToken = await validateIpnToken(
        paymentData.ipnToken,
        paymentData.addressIn
      );
      if (!isValidToken) {
        return NextResponse.json(
          { error: 'Invalid IPN token' },
          { status: 401 }
        );
      }
    }

    // Handle different payment statuses
    switch (paymentData.status) {
      case 'paid':
      case 'success':
      case 'completed':
        // Payment successful - update order, send confirmation, etc.
        await handleSuccessfulPayment(paymentData);
        break;
      
      case 'pending':
        // Payment pending - update order status, wait for confirmation
        await handlePendingPayment(paymentData);
        break;
      
      case 'failed':
      case 'error':
      case 'cancelled':
        // Payment failed - update order, notify customer, etc.
        await handleFailedPayment(paymentData);
        break;
      
      default:
        // Unknown status - log for review
        console.warn('Unknown payment status:', status);
        await handleUnknownStatus(paymentData);
    }

    // Return success response to PayGate
    // PayGate expects a 200 OK response to acknowledge receipt
    return NextResponse.json(
      { 
        success: true,
        message: 'Callback received and processed',
        transactionId: paymentData.transactionId,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing PayGate callback:', error);
    
    // Return error response
    // Note: PayGate may retry on error, so handle carefully
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(paymentData: ProcessedPaymentData) {
  // TODO: Implement your success handling logic
  // Example: Update order status in database
  console.log('Processing successful payment:', paymentData);
  
  // Example database update:
  // await db.orders.update({
  //   where: { transactionId: paymentData.transactionId },
  //   data: { 
  //     status: 'paid',
  //     paidAt: new Date(),
  //     amount: paymentData.amount,
  //   }
  // });
}

/**
 * Handle pending payment
 */
async function handlePendingPayment(paymentData: ProcessedPaymentData) {
  // TODO: Implement your pending handling logic
  console.log('Processing pending payment:', paymentData);
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(paymentData: ProcessedPaymentData) {
  // TODO: Implement your failure handling logic
  console.log('Processing failed payment:', paymentData);
}

/**
 * Handle unknown payment status
 */
async function handleUnknownStatus(paymentData: ProcessedPaymentData) {
  // TODO: Implement your unknown status handling logic
  console.log('Processing unknown status payment:', paymentData);
}

