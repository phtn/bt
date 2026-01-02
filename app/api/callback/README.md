# PayGate Callback Endpoint

This endpoint handles payment notifications from PayGate.to via GET requests.

## Endpoint

```
GET /api/callback
```

## Overview

PayGate.to will send GET requests to your callback URL (specified when creating a wallet via `wallet.php`) with payment information. This endpoint processes those notifications and updates your system accordingly.

## Query Parameters

The endpoint accepts the following query parameters:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `address_in` | Yes | Encrypted wallet address from `wallet.php` response |
| `transaction_id` (or `txid`/`id`) | Yes | Unique transaction identifier |
| `status` | Yes | Payment status: `paid`, `pending`, `failed`, etc. |
| `amount` | No | Payment amount |
| `currency` | No | Currency code (USD, EUR, CAD, etc.) |
| `ipn_token` | No | IPN token for validation (from `wallet.php` response) |
| `callback_url` | No | Original callback URL |

## Payment Status Values

The endpoint handles the following payment statuses:

- **`paid`**, **`success`**, **`completed`**: Payment successful
- **`pending`**: Payment pending confirmation
- **`failed`**, **`error`**, **`cancelled`**: Payment failed

## Usage Example

When creating a wallet, specify this callback URL:

```typescript
const callbackUrl = encodeURIComponent('https://yourdomain.com/api/callback');
const walletResponse = await fetch(
  `https://api.paygate.to/control/wallet.php?address=${walletAddress}&callback=${callbackUrl}`
);
```

PayGate will then send GET requests to your callback URL like:

```
GET /api/callback?address_in=xxx&transaction_id=yyy&status=paid&amount=100.50&currency=USD&ipn_token=zzz
```

## Response

The endpoint returns a JSON response:

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Callback received and processed",
  "transactionId": "xxx"
}
```

**Error (400/401/500):**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Implementation Notes

1. **IPN Token Validation**: The endpoint includes a placeholder for IPN token validation. Implement the `validateIpnToken` function in `utils.ts` to verify callbacks are legitimate.

2. **Business Logic**: Update the handler functions (`handleSuccessfulPayment`, `handlePendingPayment`, etc.) in `route.ts` to implement your specific business logic:
   - Update order status in database
   - Send confirmation emails
   - Update inventory
   - Trigger fulfillment processes

3. **Logging**: The endpoint logs all callbacks for debugging. In production, replace console.log with a proper logging service.

4. **Error Handling**: PayGate may retry failed callbacks, so ensure your endpoint is idempotent and handles duplicate notifications gracefully.

## Security Considerations

- Always validate the IPN token when provided
- Use HTTPS for your callback URL
- Implement rate limiting to prevent abuse
- Store and verify transaction IDs to prevent duplicate processing
- Log all callbacks for auditing purposes

## Testing

You can test the endpoint locally:

```bash
# Test successful payment
curl "http://localhost:3000/api/callback?address_in=test123&transaction_id=tx_123&status=paid&amount=100&currency=USD"

# Test pending payment
curl "http://localhost:3000/api/callback?address_in=test123&transaction_id=tx_456&status=pending"

# Test failed payment
curl "http://localhost:3000/api/callback?address_in=test123&transaction_id=tx_789&status=failed"
```

## Documentation Reference

For more details, see the [PayGate API Documentation](https://documenter.getpostman.com/view/14826208/2sA3Bj9aBi#9f7c5d95-9ca3-495a-931a-128d76ecd92e).

