const payload = {
  countryCode: 'PH',
  destinationCurrencyCode: 'USDC',
  paymentMethodType: 'PAYMAYA',
  sourceAmount: 3000,
  sourceCurrencyCode: 'PHP',
  walletAddress: '0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2'
}

const cust = {
  id: 'WePY7ZvueLFbz3yE7x739j',
  externalSessionId: null,
  externalCustomerId: null,
  customerId: 'WePY7cpju8X9W1PWYMaEJ2',
  widgetUrl:
    'https://meldcrypto.com?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTQyMTEzLCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDM5MTMsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBZN1p2dWVMRmJ6M3lFN3g3MzlqIn0.kDkCJLvaA1vTuVrup4A2GBCYA3RcwDiRACPKCFCMmmQ',
  serviceProviderWidgetUrl: null,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTQyMTEzLCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDM5MTMsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBZN1p2dWVMRmJ6M3lFN3g3MzlqIn0.kDkCJLvaA1vTuVrup4A2GBCYA3RcwDiRACPKCFCMmmQ'
}

export const POST = async (request: Request) => {
  // const req = await request.json()
  const token = await fetch('https://meldcrypto.com/_api/crypto/session/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'BASIC WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU',
      Accept: 'application/json',
      'X-Crypto-Session-Token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTM5NDMyLCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDEyMzIsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBWdWcyS21LemdDQjNGN0Y0OGNZIn0.Wax9AqTvm3lYp0wYVgxPxuoiUxNhSnt_p_oyn_70xd4'
    },
    body: JSON.stringify(payload)
  })

  if (!token.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data', status: token.status, data: payload }), {
      status: token.status
    })
  }

  const getQuote = await fetch('https://meldcrypto.com/_api/crypto/session/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'BASIC WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU',
      Accept: 'application/json',
      'X-Crypto-Session-Token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTM5NDMyLCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDEyMzIsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBWdWcyS21LemdDQjNGN0Y0OGNZIn0.Wax9AqTvm3lYp0wYVgxPxuoiUxNhSnt_p_oyn_70xd4'
    },
    body: JSON.stringify(payload)
  })

  // const response = await fetch(`${process.env.MELD_API_URL}/api/meld/${environment}/${endpoint}`, {
  //   headers: {
  //     Authorization: `Bearer ${process.env.MELD_API_KEY}`
  //   }
  //
  // })

  if (!getQuote.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data', status: getQuote.status, data: payload }), {
      status: getQuote.status
    })
  }

  const data = await getQuote.json()
  console.log(data)
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/*

{
    "id": "WePXkKJxo5y5iDr3HeHtpV",
    "externalSessionId": null,
    "externalCustomerId": null,
    "customerId": "WePXkJwZRqo2WjG252BuZt",
    "widgetUrl": "https://meldcrypto.com?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTQxNDk1LCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDMyOTUsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBYa0tKeG81eTVpRHIzSGVIdHBWIn0.orKrX0mQzQIsz86S0IfokGozHimc92eeG3Ft_ZneMuA",
    "serviceProviderWidgetUrl": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZWxkLmlvIiwiaWF0IjoxNzY2NTQxNDk1LCJzdWIiOiJjcnlwdG8iLCJleHAiOjE3NjY1NDMyOTUsImFjY291bnRJZCI6IldYRVRNdlpvMUZBTXZ0bjRqTXNaZkwiLCJzZXNzaW9uSWQiOiJXZVBYa0tKeG81eTVpRHIzSGVIdHBWIn0.orKrX0mQzQIsz86S0IfokGozHimc92eeG3Ft_ZneMuA"
}
*/
