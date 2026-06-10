'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const KPICard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background: '#FFFDF8',
    borderRadius: '12px',
    padding: '24px',
    borderLeft: `4px solid ${color}`,
    boxShadow: '0 2px 8px rgba(61,31,13,0.08)',
    flex: 1,
    minWidth: '200px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 8px', color: '#8B7355', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {label}
        </p>
        <p style={{ margin: '0 0 4px', color: '#3D1F0D', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          {value}
        </p>
        <p style={{ margin: 0, color: '#A0722A', fontSize: '12px' }}>{sub}</p>
      </div>
      <div style={{
        width: '48px', height: '48px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px',
      }}>
        {icon}
      </div>
    </div>
  </div>
)

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#A0722A', fontFamily: 'Georgia, serif' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
      <p>Memuat data dashboard...</p>
    </div>
  )

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #3D1F0D, #6B3A2A)',
        borderRadius: '12px',
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px', color: '#F9F3E8', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Selamat Datang di SMIS Bellene 👋
          </h2>
          <p style={{ margin: 0, color: '#C4956A', fontSize: '14px' }}>
            Sistem Manajemen Informasi Persediaan · Bellene Leather Garut
          </p>
        </div>
        <div style={{ fontSize: '48px' }}>🏷️</div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <KPICard icon="🏷️" label="Total Produk Aktif" value={data?.totalProduk ?? 0}
          sub="produk terdaftar" color="#A0722A" />
        <KPICard icon="📦" label="Total Stok Tersedia" value={data?.totalStok ?? 0}
          sub="unit tersedia" color="#2563EB" />
        <KPICard icon="💰" label="Transaksi Hari Ini" value={data?.transaksiHariIni ?? 0}
          sub="transaksi hari ini" color="#16A34A" />
        <KPICard icon="📱" label="Scan QR Bulan Ini" value={data?.totalScan ?? 0}
          sub="scan oleh konsumen" color="#9333EA" />
      </div>

      {/* Charts & Alerts Row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Grafik Transaksi 7 Hari */}
        <div style={{
          background: '#FFFDF8',
          borderRadius: '12px',
          padding: '24px',
          flex: 2,
          minWidth: '300px',
          boxShadow: '0 2px 8px rgba(61,31,13,0.08)',
        }}>
          <h3 style={{ margin: '0 0 24px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
            📈 Transaksi 7 Hari Terakhir
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.grafik7Hari || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8B7355' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B7355' }}
                tickFormatter={(v) => v === 0 ? '0' : `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [`Rp ${Number(v).toLocaleString('id-ID')}`, 'Total']}
                contentStyle={{ background: '#FFFDF8', border: '1px solid #E8DCC8', borderRadius: '8px' }}
              />
              <Bar dataKey="total" fill="#A0722A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stok Kritis */}
        <div style={{
          background: '#FFFDF8',
          borderRadius: '12px',
          padding: '24px',
          flex: 1,
          minWidth: '250px',
          boxShadow: '0 2px 8px rgba(61,31,13,0.08)',
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
            ⚠️ Stok Kritis
          </h3>
          {data?.produkKritis?.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 16px',
              color: '#16A34A', background: '#F0FDF4',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <p style={{ margin: 0, fontSize: '13px' }}>Semua stok aman</p>
            </div>
          ) : (
            data?.produkKritis?.map(p => (
              <div key={p.id_produk} style={{
                padding: '12px',
                background: '#FEF2F2',
                borderRadius: '8px',
                marginBottom: '8px',
                borderLeft: '3px solid #DC2626',
              }}>
                <p style={{ margin: '0 0 4px', color: '#3D1F0D', fontSize: '13px', fontWeight: 'bold' }}>
                  {p.nama_produk}
                </p>
                <p style={{ margin: 0, color: '#DC2626', fontSize: '12px' }}>
                  SKU: {p.sku} · Sisa {p.stok} pcs
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}