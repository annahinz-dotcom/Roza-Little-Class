import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { session, signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signInWithPassword(email, password)
    setLoading(false)
    if (error) setError(error)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-card bg-dusty text-2xl font-extrabold text-cream shadow-soft">
            R
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Róża's Little Class</h1>
          <p className="mt-1 text-sm text-navy/50">A warm little space for home classes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-card bg-card p-5 shadow-soft">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-navy outline-none focus:border-dusty"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-navy outline-none focus:border-dusty"
            />
          </div>
          {error && <p className="text-sm font-semibold text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-pill bg-honey py-3 font-bold text-white shadow-softer transition-opacity disabled:opacity-60"
          >
            {loading ? 'Opening…' : 'Open the class box'}
          </button>
        </form>
      </div>
    </div>
  )
}
