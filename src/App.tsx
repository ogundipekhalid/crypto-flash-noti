import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Wallet, 
  Send, 
  History, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Smartphone,
  Info
} from 'lucide-react'
import { blink } from './lib/blink'
import type { Contact, Transaction, Page, CoinType } from './types'
import { COIN_TYPES, COIN_NETWORKS } from './types'
import toast from 'react-hot-toast'

// Generate unique ID
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generate notification message
const generateMessage = (coinType: string, amount: string, recipientName: string) => {
  const network = COIN_NETWORKS[coinType] || 'Custom Network'
  const now = new Date().toISOString().split('T')[0]
  
  return `Transaction Alert

You have received ${amount} ${coinType}.

Recipient: ${recipientName}
Network: ${network}
Status: Pending Confirmation
Time: ${now}`
}

// Disclaimer Component
function Disclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-sm">Educational Tool</h4>
          <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
            This tool simulates cryptocurrency notifications for testing and educational purposes only. 
            It does not perform real blockchain transactions.
          </p>
        </div>
      </div>
    </div>
  )
}

// Navigation Component
function Navigation({ currentPage, navigateTo }: { currentPage: Page; navigateTo: (page: Page) => void }) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts' as Page, label: 'Contacts', icon: Users },
    { id: 'send' as Page, label: 'Send', icon: Send },
    { id: 'history' as Page, label: 'History', icon: History },
    { id: 'demo' as Page, label: 'Demo', icon: Smartphone },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">Crypto Flash</h1>
              <p className="text-xs text-muted-foreground">Notification Simulator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Dashboard Page
function DashboardPage() {
  const queryClient = useQueryClient()
  
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await blink.db.contacts.list({ orderBy: { createdAt: 'desc' } })
      return result as Contact[]
    }
  })
  
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const result = await blink.db.transactions.list({ orderBy: { createdAt: 'desc' } })
      return result as Transaction[]
    }
  })

  const stats = [
    { 
      label: 'Total Contacts', 
      value: contacts.length, 
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      label: 'Transactions', 
      value: transactions.length, 
      icon: Send,
      color: 'text-primary',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    { 
      label: 'Sent', 
      value: transactions.filter(t => t.status === 'sent').length, 
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      label: 'Viewed', 
      value: transactions.filter(t => t.status === 'viewed').length, 
      icon: Eye,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your notification simulator</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {transactions.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="font-mono text-sm font-bold text-primary">{tx.coinType.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.amount} {tx.coinType}</p>
                    <p className="text-sm text-muted-foreground">To: {tx.recipientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${tx.status === 'simulated' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : ''}
                    ${tx.status === 'sent' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                    ${tx.status === 'viewed' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                  `}>
                    {tx.status === 'simulated' && <Clock className="w-3 h-3" />}
                    {tx.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                    {tx.status === 'viewed' && <Eye className="w-3 h-3" />}
                    {tx.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(tx.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Contacts Page
function ContactsPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await blink.db.contacts.list({ orderBy: { createdAt: 'desc' } })
      return result as Contact[]
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; walletAddress: string; notes: string }) => {
      const contact = {
        id: generateId(),
        name: data.name,
        walletAddress: data.walletAddress || undefined,
        notes: data.notes || undefined,
        createdAt: new Date().toISOString()
      }
      await blink.db.contacts.create(contact)
      return contact
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      setName('')
      setWalletAddress('')
      setNotes('')
      setShowForm(false)
      toast.success('Contact created successfully!')
    },
    onError: () => {
      toast.error('Failed to create contact')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await blink.db.contacts.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Contact deleted')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({ name, walletAddress, notes })
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">Contacts</h2>
          <p className="text-muted-foreground mt-1">Manage your wallet contacts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h3 className="font-display text-lg font-semibold mb-4">New Contact</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John Wallet"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="0x123... (optional)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Optional notes about this contact"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending || !name.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Contact'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contacts yet. Add your first contact!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-all hover:border-primary/30 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-100 dark:to-orange-900/20 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(contact.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-display font-semibold text-foreground">{contact.name}</h3>
              {contact.walletAddress && (
                <p className="font-mono text-sm text-muted-foreground mt-1 truncate">
                  {contact.walletAddress}
                </p>
              )}
              {contact.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{contact.notes}</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Added {formatDate(contact.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Send Notification Page
function SendPage() {
  const queryClient = useQueryClient()
  const [selectedContact, setSelectedContact] = useState('')
  const [coinType, setCoinType] = useState<CoinType>('BTC')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [customCoin, setCustomCoin] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await blink.db.contacts.list()
      return result as Contact[]
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: { recipientName: string; coinType: string; amount: string; message: string }) => {
      const transaction = {
        id: generateId(),
        recipientName: data.recipientName,
        coinType: data.coinType,
        amount: data.amount,
        message: data.message,
        status: 'simulated',
        createdAt: new Date().toISOString()
      }
      await blink.db.transactions.create(transaction)
      return transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Notification sent successfully!')
      setSelectedContact('')
      setCoinType('BTC')
      setAmount('')
      setMessage('')
      setCustomCoin('')
      setShowPreview(false)
    },
    onError: () => {
      toast.error('Failed to send notification')
    }
  })

  const handleGenerateMessage = () => {
    if (!selectedContact || !amount) return
    const contact = contacts.find(c => c.id === selectedContact)
    const finalCoin = coinType === 'Custom' ? customCoin : coinType
    setMessage(generateMessage(finalCoin, amount, contact?.name || 'Unknown'))
  }

  const handleSend = () => {
    if (!selectedContact || !amount || !message) return
    const contact = contacts.find(c => c.id === selectedContact)
    const finalCoin = coinType === 'Custom' ? customCoin : coinType
    createMutation.mutate({
      recipientName: contact?.name || 'Unknown',
      coinType: finalCoin,
      amount,
      message
    })
  }

  const selectedContactData = contacts.find(c => c.id === selectedContact)
  const finalCoin = coinType === 'Custom' ? customCoin : coinType
  const isValid = selectedContact && amount && (coinType === 'Custom' ? customCoin : true) && message

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Send Notification</h2>
        <p className="text-muted-foreground mt-1">Simulate a crypto transaction notification</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Transaction Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Recipient *</label>
                <select
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Coin Type *</label>
                  <select
                    value={coinType}
                    onChange={(e) => setCoinType(e.target.value as CoinType)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {COIN_TYPES.map(coin => (
                      <option key={coin} value={coin}>{coin}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Amount *</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.5"
                  />
                </div>
              </div>

              {coinType === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Custom Coin Name *</label>
                  <input
                    type="text"
                    value={customCoin}
                    onChange={(e) => setCustomCoin(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="XRP"
                  />
                </div>
              )}

              <button
                onClick={handleGenerateMessage}
                disabled={!selectedContact || !amount}
                className="w-full py-2 border border-dashed border-border rounded-lg font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Auto Message
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter notification message..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can edit the auto-generated message or write your own.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
            <h3 className="font-display text-lg font-semibold mb-4">Preview</h3>
            
            {selectedContact && amount && finalCoin ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-orange-50 dark:to-orange-950/20 rounded-xl p-5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                      <span className="font-mono font-bold text-white">{finalCoin.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-lg">{amount} {finalCoin}</p>
                      <p className="text-sm text-muted-foreground">to {selectedContactData?.name}</p>
                    </div>
                  </div>
                  
                  {message && (
                    <div className="bg-background/50 rounded-lg p-3 text-sm font-mono text-foreground whitespace-pre-wrap">
                      {message}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSend}
                  disabled={!isValid || createMutation.isPending}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {createMutation.isPending ? 'Sending...' : 'Send Notification'}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  This is a simulated notification. No real blockchain transaction will occur.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the details to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// History Page
function HistoryPage() {
  const queryClient = useQueryClient()
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const result = await blink.db.transactions.list({ orderBy: { createdAt: 'desc' } })
      return result as Transaction[]
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await blink.db.transactions.update(id, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Status updated!')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await blink.db.transactions.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction deleted')
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'simulated': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      case 'sent': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      case 'viewed': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Transaction History</h2>
        <p className="text-muted-foreground mt-1">View all simulated notifications</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No transactions yet. Send your first notification!</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 font-display font-semibold text-foreground">Recipient</th>
                  <th className="text-left px-6 py-4 font-display font-semibold text-foreground">Coin</th>
                  <th className="text-left px-6 py-4 font-display font-semibold text-foreground">Amount</th>
                  <th className="text-left px-6 py-4 font-display font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 font-display font-semibold text-foreground">Date</th>
                  <th className="text-right px-6 py-4 font-display font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr 
                    key={tx.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-mono text-xs font-bold text-primary">
                            {tx.recipientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{tx.recipientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">
                        {tx.coinType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-foreground">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={tx.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: tx.id, status: e.target.value })}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(tx.status)}`}
                        >
                          <option value="simulated">Simulated</option>
                          <option value="sent">Sent</option>
                          <option value="viewed">Viewed</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(tx.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Demo Page - Educational: Shows what scam notifications look like
function DemoPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Scam Notification Demo</h2>
        <p className="text-muted-foreground mt-1">Educational: See how fake wallet notifications appear</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Educational Warning */}
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-red-800 dark:text-red-400">For Educational Purposes Only</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-2">
                  This page shows how scammers create fake wallet notifications to deceive victims. 
                  Use this knowledge to protect yourself and others from crypto scams.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4">How Scam Notifications Work</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <p>Scammers create fake transaction notifications that look like real blockchain transfers</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <p>They show a wallet address and amount to make it appear legitimate</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <p>The victim sees the "transaction" and trusts the scammer</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">4</span>
                </div>
                <p>Scammer then asks for fees or personal info to "release" the funds</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Red Flags to Watch
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                Unsolicited transaction notifications
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                Requests for upfront fees to release funds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                Pressure to act quickly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                Claims of "trapped" or "pending" funds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">●</span>
                Poor grammar or suspicious URLs
              </li>
            </ul>
          </div>
        </div>

        {/* Mock Scam Notification - Mobile Phone Frame */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-[320px] h-[650px] bg-gray-900 rounded-[40px] p-3 shadow-2xl">
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden relative">
                {/* Status Bar */}
                <div className="bg-white dark:bg-gray-900 px-4 py-2 flex justify-between items-center text-xs">
                  <span className="text-gray-900 dark:text-white font-medium">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 border border-gray-600 rounded-sm"></div>
                    <div className="w-0.5 h-2.5 bg-gray-600"></div>
                  </div>
                </div>

                {/* App Header */}
                <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">₿</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold">CryptoWallet</span>
                  </div>
                </div>

                {/* Transaction Screen */}
                <div className="p-4">
                  <div className="text-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Transfer Out</p>
                    
                    {/* Bitcoin Logo */}
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">₿</span>
                    </div>

                    {/* Amount */}
                    <p className="text-4xl font-bold text-red-600">-800.00 BTC</p>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">$67.21 M</p>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Date</span>
                      <span className="text-gray-900 dark:text-white text-sm">Apr 16, 2025 at 12:20 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Fee</span>
                      <span className="text-gray-900 dark:text-white text-sm">$153.00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Notes</span>
                      <span className="text-gray-900 dark:text-white text-xs font-mono">369SCL29mCqYuKN7...</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Portfolio</span>
                      <span className="text-gray-900 dark:text-white text-sm flex items-center gap-1">
                        CRYPTO CURRENCY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4">
                  <div className="flex justify-around items-center">
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-gray-500">Home</span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-gray-500">Send</span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-gray-500">History</span>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1"></div>
                      <span className="text-xs text-gray-500">Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  // Use hash-based routing for simpler navigation
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#/', '') as Page
    return ['dashboard', 'contacts', 'send', 'history', 'demo'].includes(hash) ? hash : 'dashboard'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') as Page
      if (['dashboard', 'contacts', 'send', 'history', 'demo'].includes(hash)) {
        setCurrentPage(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (page: Page) => {
    window.location.hash = `/${page}`
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'contacts':
        return <ContactsPage />
      case 'send':
        return <SendPage />
      case 'history':
        return <HistoryPage />
      case 'demo':
        return <DemoPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} navigateTo={navigateTo} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Disclaimer />
        {renderPage()}
      </main>
      
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Crypto Flash Notifier — Educational Tool Only
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
