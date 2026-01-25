# Meld Webhook Handler

This endpoint handles webhook events from Meld for transaction status updates.

## Setup

1. **Add webhook secret to `.env.local`**:
   ```env
   MELD_WEBHOOK_SECRET=your_webhook_secret_from_meld_dashboard
   ```

2. **Configure webhook URL in Meld Dashboard**:
   - Go to your Meld dashboard
   - Navigate to Webhook settings
   - Set webhook URL to: `https://yourdomain.com/api/webhooks/meld/dev`
   - Copy the webhook secret and add it to `.env.local`

## Webhook Events Handled

- `TRANSACTION_CRYPTO_PENDING` - User started payment process
- `TRANSACTION_CRYPTO_TRANSFERRING` - Payment approved, crypto transfer in progress
- `TRANSACTION_CRYPTO_COMPLETE` - Transaction completed successfully
- `TRANSACTION_CRYPTO_FAILED` - Transaction failed or encountered error
- `WEBHOOK_TEST` - Test webhook to verify configuration

## Security

The endpoint verifies webhook signatures using HMAC SHA256:
- Signature format: `base64url(HMACSHA256(<TIMESTAMP>.<URL>.<BODY>))`
- Headers required: `meld-signature` and `meld-signature-timestamp`
- Invalid signatures return 401 Unauthorized

## Response

The endpoint returns `200 OK` with:
```json
{
  "received": true,
  "eventId": "event_id",
  "eventType": "TRANSACTION_CRYPTO_COMPLETE"
}
```

## Testing

1. Use Meld's webhook test feature in the dashboard
2. Or send a test request:
   ```bash
   curl -X GET http://localhost:3000/api/webhooks/meld/dev
   ```

## Implementation Notes

- All webhook events are logged to console
- TODO comments indicate where to add your business logic
- Use `eventId` for idempotency (handle duplicate deliveries)
- Always return 2xx status codes to acknowledge receipt
