'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9F3E8',
      }}>
        <div style={{ textAlign: 'center', color: '#A0722A', fontFamily: 'Georgia, serif' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p>Memuat sistem...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const menuItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/produk', icon: '🏷️', label: 'Master Produk' },
    { href: '/admin/pengrajin', icon: '👨‍🎨', label: 'Master Pengrajin' },
    { href: '/admin/persediaan', icon: '📦', label: 'Persediaan' },
    { href: '/admin/transaksi', icon: '💰', label: 'Transaksi' },
    { href: '/admin/laporan', icon: '📋', label: 'Laporan' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '64px',
        background: 'linear-gradient(180deg, #3D1F0D 0%, #5C2E1A 100%)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 16px',
          borderBottom: '1px solid rgba(160,114,42,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}>🏷️</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: '#F9F3E8', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Georgia, serif' }}>
                Bellene
              </div>
              <div style={{ color: '#A0722A', fontSize: '10px', letterSpacing: '1px' }}>
                SMIS ADMIN
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 8px', flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: isActive ? 'rgba(160,114,42,0.3)' : 'transparent',
                  borderLeft: isActive ? '3px solid #A0722A' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <span style={{
                      color: isActive ? '#C4956A' : '#D4C4B0',
                      fontSize: '13px',
                      fontWeight: isActive ? 'bold' : 'normal',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(160,114,42,0.3)',
        }}>
          {sidebarOpen && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#F9F3E8', fontSize: '12px', fontWeight: 'bold' }}>
                {session.user.name}
              </div>
              <div style={{ color: '#A0722A', fontSize: '10px', textTransform: 'uppercase' }}>
                {session.user.role}
              </div>
            </div>
          )}
          <button
            onClick={async () => {
              await signOut({ redirect: false })
              router.push('/login')
            }}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(220,38,38,0.2)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '6px',
              color: '#FCA5A5',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '-12px',
            width: '24px',
            height: '24px',
            background: '#A0722A',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? '240px' : '64px',
        flex: 1,
        background: '#F5EFE6',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Top Bar */}
        <div style={{
          background: '#FFFDF8',
          borderBottom: '1px solid #E8DCC8',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h1 style={{ margin: 0, color: '#3D1F0D', fontSize: '20px', fontFamily: 'Georgia, serif' }}>
            {menuItems.find(m => m.href === pathname)?.label || 'Admin Panel'}
          </h1>
          <div style={{ color: '#8B7355', fontSize: '13px' }}>
            🕐 {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}