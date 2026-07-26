'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'Configuration') {
          setError('Server belum dikonfigurasi dengan benar (NEXTAUTH_SECRET / NEXTAUTH_URL).')
        } else {
          setError('Email atau password salah. Silakan coba lagi.')
        }
        return
      }

      if (!result?.ok) {
        setError('Login gagal. Periksa koneksi atau coba lagi.')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Tidak dapat terhubung ke server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3D1F0D 0%, #6B3A2A 50%, #A0722A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
    }}>
      {/* Background texture overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }} />

      <div style={{
        background: '#F9F3E8',
        borderRadius: '16px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px',
          }}>
            🏷️
          </div>
          <h1 style={{
            color: '#3D1F0D',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 4px',
            letterSpacing: '0.5px',
          }}>
            Bellene Leather
          </h1>
          <p style={{
            color: '#A0722A',
            fontSize: '13px',
            margin: '0 0 4px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            SMIS Admin Panel
          </p>
          <p style={{
            color: '#8B7355',
            fontSize: '12px',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}>
            Sukaregang, Garut — Since 1970
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #A0722A, transparent)',
          marginBottom: '32px',
        }} />

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#3D1F0D',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bellene.id"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E8DCC8',
                borderRadius: '8px',
                background: '#FFFDF8',
                color: '#3D1F0D',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#A0722A'}
              onBlur={(e) => e.target.style.borderColor = '#E8DCC8'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#3D1F0D',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E8DCC8',
                borderRadius: '8px',
                background: '#FFFDF8',
                color: '#3D1F0D',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#A0722A'}
              onBlur={(e) => e.target.style.borderColor = '#E8DCC8'}
            />
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#DC2626',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading
                ? '#C4956A'
                : 'linear-gradient(135deg, #A0722A, #C4956A)',
              color: '#F9F3E8',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? '⏳ Masuk...' : 'MASUK KE SISTEM'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: '#B8A898',
          fontSize: '11px',
          marginTop: '24px',
          marginBottom: 0,
          fontFamily: 'Inter, sans-serif',
        }}>
          SMIS v1.0 · Hibah PkM 2026 · BINUS University
        </p>
      </div>
    </div>
  )
}