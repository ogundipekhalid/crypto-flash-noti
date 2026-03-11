import { createClient } from '@blinkdotnew/sdk'

// Public access - no auth required based on security policy
export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'crypto-flash-notifier-nqlo33vz',
  auth: { mode: 'managed' }
}) as any
