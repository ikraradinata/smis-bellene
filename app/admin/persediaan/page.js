'use client'

import { useEffect, useState } from 'react'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '2px solid #E8DCC8',
  borderRadius: '8px',
  background: '#FFFDF8',
  color: '#3D1F0D',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  color: '#3D1F0D',
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '6px',
  letterSpacing: '0.5px',
}

const statusConfig = {
  Aman:   { color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
  Kritis: { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  Habis:  { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
}

export default function PersediaanPage() {
  const [stokList, setStokList]     = useState([])
  const [riwayat, setRiwayat]       = useState([])
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab]   = useState('rekap')

  const [form, setForm] = useState({
    id_produk: '',
    jenis_mutasi: 'masuk',
    jumlah: '',
    keterangan: '',
  })

  const fetchData = async () => {
    setLoading(true)
    const [stok, rwyt, produk] = await Promise.all([
      fetch('/api/persediaan').then(r => r.json()),
      fetch('/api/persediaan/riwayat').then(r => r.json()),
      fetch('/api/produk').then(r => r.json()),
    ])
    setStokList(stok)
    setRiwayat(rwyt)
    setProdukList(produk)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    if (!form.id_produk || !form.jumlah) {
      setError('Produk dan jumlah wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch('/api/persediaan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccessMsg('✅ Mutasi stok berhasil dicatat!')
      setForm({ id_produk: '', jenis_mutasi: 'masuk', jumlah: '', keterangan: '' })
      setShowForm(false)
      fetchData()
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const totalAman   = stokList.filter(s => s.status === 'Aman').length
  const totalKritis = stokList.filter(s => s.status === 'Kritis').length
  const totalHabis  = stokList.filter(s => s.status === 'Habis').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Manajemen Persediaan
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            {stokList.length} produk terpantau
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            border: 'none', borderRadius: '8px', color: '#F9F3E8',
            cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
          }}>
          ➕ Input Mutasi Stok
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{
          background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '20px', color: '#16A34A', fontSize: '14px',
        }}>
          {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Stok Aman', value: totalAman, icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Stok Kritis', value: totalKritis, icon: '⚠️', color: '#D97706', bg: '#FEF3C7' },
          { label: 'Stok Habis', value: totalHabis, icon: '🔴', color: '#DC2626', bg: '#FEE2E2' },
          { label: 'Total Produk', value: stokList.length, icon: '📦', color: '#A0722A', bg: '#FDF8F0' },
        ].map(c => (
          <div key={c.label} style={{
            flex: 1, background: c.bg, borderRadius: '12px', padding: '20px',
            border: `1px solid ${c.color}30`, textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: c.color, fontFamily: 'Georgia, serif' }}>
              {c.value}
            </div>
            <div style={{ fontSize: '12px', color: '#8B7355', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#FFFDF8', borderRadius: '10px', padding: '4px', width: 'fit-content', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
        {[
          { key: 'rekap', label: '📊 Rekap Stok' },
          { key: 'riwayat', label: '📋 Riwayat Mutasi' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 20px',
            background: activeTab === t.key ? '#A0722A' : 'transparent',
            color: activeTab === t.key ? '#F9F3E8' : '#8B7355',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: activeTab === t.key ? 'bold' : 'normal',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab: Rekap Stok */}
      {activeTab === 'rekap' && (
        <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#3D1F0D' }}>
                {['SKU', 'Nama Produk', 'Jenis Kulit', 'Total Masuk', 'Total Keluar', 'Stok Tersedia', 'Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: '#C4956A', fontSize: '12px', letterSpacing: '1px', textAlign: 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>⏳ Memuat...</td></tr>
              ) : stokList.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>Belum ada data</td></tr>
              ) : stokList.map((s, i) => {
                const st = statusConfig[s.status]
                return (
                  <tr key={s.id_produk} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <code style={{ background: '#F0E8D8', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#A0722A', fontWeight: 'bold' }}>
                        {s.sku}
                      </code>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#3D1F0D', fontSize: '14px', fontWeight: '500' }}>{s.nama_produk}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#EDD9B5', color: '#5C3317', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        {s.jenis_kulit}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#16A34A', fontWeight: 'bold', fontSize: '14px' }}>
                      +{s.total_masuk}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#DC2626', fontWeight: 'bold', fontSize: '14px' }}>
                      -{s.total_keluar}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#3D1F0D', fontWeight: 'bold', fontSize: '16px' }}>
                      {s.stok_tersedia} <span style={{ fontSize: '12px', color: '#8B7355', fontWeight: 'normal' }}>pcs</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                        {s.status === 'Aman' ? '✅' : s.status === 'Kritis' ? '⚠️' : '🔴'} {s.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Riwayat Mutasi */}
      {activeTab === 'riwayat' && (
        <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#3D1F0D' }}>
                {['Tanggal', 'SKU', 'Nama Produk', 'Jenis', 'Jumlah', 'Keterangan'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: '#C4956A', fontSize: '12px', letterSpacing: '1px', textAlign: 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>⏳ Memuat...</td></tr>
              ) : riwayat.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>Belum ada riwayat mutasi</td></tr>
              ) : riwayat.map((r, i) => {
                const isMasuk = r.stok_masuk > 0
                return (
                  <tr key={r.id_persediaan} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                    <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>
                      {new Date(r.tanggal_update).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <code style={{ background: '#F0E8D8', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#A0722A', fontWeight: 'bold' }}>
                        {r.produk.sku}
                      </code>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#3D1F0D', fontSize: '13px' }}>{r.produk.nama_produk}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: isMasuk ? '#F0FDF4' : '#FEE2E2',
                        color: isMasuk ? '#16A34A' : '#DC2626',
                        padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      }}>
                        {isMasuk ? '📥 Masuk' : '📤 Keluar'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', fontSize: '15px', color: isMasuk ? '#16A34A' : '#DC2626' }}>
                      {isMasuk ? '+' : '-'}{isMasuk ? r.stok_masuk : r.stok_keluar} pcs
                    </td>
                    <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>
                      {r.keterangan || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Mutasi */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#F9F3E8', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '480px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
                ➕ Input Mutasi Stok
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Jenis Mutasi Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>JENIS MUTASI</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['masuk', 'keluar'].map(j => (
                  <button key={j} onClick={() => setForm({ ...form, jenis_mutasi: j })} style={{
                    flex: 1, padding: '12px',
                    background: form.jenis_mutasi === j
                      ? (j === 'masuk' ? '#16A34A' : '#DC2626')
                      : '#F0E8D8',
                    color: form.jenis_mutasi === j ? 'white' : '#8B7355',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 'bold',
                  }}>
                    {j === 'masuk' ? '📥 Stok Masuk' : '📤 Stok Keluar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilih Produk */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>PRODUK</label>
              <select style={inputStyle} value={form.id_produk}
                onChange={e => setForm({ ...form, id_produk: e.target.value })}>
                <option value="">-- Pilih Produk --</option>
                {produkList.map(p => (
                  <option key={p.id_produk} value={p.id_produk}>
                    [{p.sku}] {p.nama_produk} — Stok: {p.stok_tersedia} pcs
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>JUMLAH (pcs)</label>
              <input type="number" min="1" style={inputStyle}
                placeholder="Masukkan jumlah..."
                value={form.jumlah}
                onChange={e => setForm({ ...form, jumlah: e.target.value })} />
            </div>

            {/* Keterangan */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>KETERANGAN</label>
              <input style={inputStyle}
                placeholder="Pengadaan barang / Penjualan online / ..."
                value={form.keterangan}
                onChange={e => setForm({ ...form, keterangan: e.target.value })} />
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowForm(false)} style={{
                flex: 1, padding: '12px', background: 'transparent',
                border: '2px solid #E8DCC8', borderRadius: '8px',
                color: '#8B7355', cursor: 'pointer', fontSize: '14px',
              }}>Batal</button>
              <button onClick={handleSubmit} disabled={saving} style={{
                flex: 2, padding: '12px',
                background: form.jenis_mutasi === 'masuk'
                  ? 'linear-gradient(135deg, #16A34A, #22C55E)'
                  : 'linear-gradient(135deg, #DC2626, #EF4444)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '14px', fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>
                {saving ? '⏳ Menyimpan...' : form.jenis_mutasi === 'masuk' ? '📥 Catat Stok Masuk' : '📤 Catat Stok Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}