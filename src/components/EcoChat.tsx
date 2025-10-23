import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/utils'

interface Message { role: string; content: string; created_at?: string }

export default function EcoChat({ userId = 'anon', city, industry }: { userId?: string; city?: string; industry?: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!draft.trim()) return
    try {
      setLoading(true)
      const res = await api<{ messages: Message[] }>(`/chat`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, city, industry, message: draft })
      })
      setMessages(res.messages)
      setDraft('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed right-0 top-20 h-[80vh] w-full sm:w-[380px] bg-background border-l transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-3 border-b flex items-center justify-between">
        <div className="font-semibold">EcoChat Assistant</div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
      </div>
      <div className="p-3 h-[calc(80vh-100px)] overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 border rounded px-3 py-2 bg-background" placeholder="Ask about mitigation, water footprint…" />
        <Button onClick={send} disabled={loading}>Send</Button>
      </div>
      <Button className="fixed right-4 bottom-6" onClick={() => setOpen(true)}>Open EcoChat</Button>
    </div>
  )
}
