export type EndpointType = 'generic' | 'health' | 'config' | 'quote'

export interface ApiResponse {
  success: boolean
  data?: unknown
  error?: string
  url?: string
}

export type MeldEnvironment = 'sandbox' | 'production'

// https://meldcrypto.com/?publicKey=WXETMuFUQmqqybHuRkSgxv%3A25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU&destinationCurrencyCode=USDC&walletAddress=0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2&externalCustomerId=c824c6ad8ab8ed4ae535821b9a481ce2
export const meld_url = {
  base: 'https://meldcrypto.com/',
  params: {
    publicKey: 'WXETMuFUQmqqybHuRkSgxv%3A25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU',
    destinationCurrencyCode: 'USDC',
    walletAddress: '0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2',
    externalCustomerId: 'c824c6ad8ab8ed4ae535821b9a481ce2'
  }
}
// https://meldcrypto.com/?publicKey=WXETMuFUQmqqybHuRkSgxv%3A25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU&destinationCurrencyCode=USDC&walletAddress=0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2&externalCustomerId=c824c6ad8ab8ed4ae535821b9a481ce2
// https://meldcrypto.com/?publicKey=WXETMuFUQmqqybHuRkSgxv%3A25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU&destinationCurrencyCode=USDC&walletAddress=0x72C378b08A43b7965EB8A8ec8E662eE41C87e5e2&externalCustomerId=c824c6ad8ab8ed4ae535821b9a481ce2
