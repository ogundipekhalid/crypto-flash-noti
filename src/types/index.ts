export interface Contact {
  id: string
  name: string
  walletAddress?: string
  email?: string
  notes?: string
  createdAt: string
}

export interface Transaction {
  id: string
  recipientName: string
  coinType: string
  amount: string
  message: string
  status: 'simulated' | 'sent' | 'viewed'
  createdAt: string
}

export type Page = 'dashboard' | 'contacts' | 'send' | 'history' | 'demo'

export const COIN_TYPES = ['BTC', 'ETH', 'USDT', 'SOL', 'DOGE', 'BNB', 'Custom'] as const
export type CoinType = typeof COIN_TYPES[number]

export const COIN_NETWORKS: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether',
  SOL: 'Solana',
  DOGE: 'Dogecoin',
  BNB: 'Binance Smart Chain',
  Custom: 'Custom Network'
}
