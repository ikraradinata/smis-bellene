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

export default function TransaksiPage() {
  const [transaksi, setTransaksi]   = useState([])
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo]     = useState('')

  const [form, setForm] = useState({
    id_produk: '',
    jumlah: '',
    harga_satuan: '',
    keterangan: '',
  })

  const [selectedProduk, setSelectedProduk] = useState(null)

  const fetchTransaksi = async () => {
    setLoading(true)
    let url = '/api/transaksi'
    if (filterFrom && filterTo) url += `?from=${filterFrom}&to=${filterTo}`
    const data = await fetch(url).then(r => r.json())
    setTransaksi(data)
    setLoading(false)
  }

  const fetchProduk = async () => {
    const data = await fetch('/api/produk').then(r => r.json())
    setProdukList(data)
  }

  useEffect(() => {
    fetchTransaksi()
    fetchProduk()
  }, [])

  useEffect(() => {
    fetchTransaksi()
  }, [filterFrom, filterTo])

  const handleProdukChange = (e) => {
    const id = e.target.value
    const p = produkList.find(x => x.id_produk === parseInt(id))
    setSelectedProduk(p || null)
    setForm({ ...form, id_produk: id, harga_satuan: p ? p.harga : '' })
  }

  const handleSubmit = async () => {
    if (!form.id_produk || !form.jumlah || !form.harga_satuan) {
      setError('Produk, jumlah, dan harga wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch('/api/transaksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccessMsg(`✅ Transaksi ${data.kode_transaksi} berhasil dicatat!`)
      setForm({ id_produk: '', jumlah: '', harga_satuan: '', keterangan: '' })
      setSelectedProduk(null)
      setShowForm(false)
      fetchTransaksi()
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  // Hitung summary
  const totalPendapatan = transaksi.reduce((s, t) => s + Number(t.total_harga), 0)
  const totalUnit = transaksi.reduce((s, t) => s + t.jumlah, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Transaksi Penjualan
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            {transaksi.length} transaksi tercatat
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
          ➕ Catat Transaksi
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#16A34A', fontSize: '14px' }}>
          {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Transaksi', value: transaksi.length, icon: '🧾', suffix: 'transaksi', color: '#A0722A', bg: '#FDF8F0' },
          { label: 'Total Unit Terjual', value: totalUnit, icon: '📦', suffix: 'pcs', color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, icon: '💰', suffix: '', color: '#16A34A', bg: '#F0FDF4' },
        ].map(c => (
          <div key={c.label} style={{
            flex: 1, background: c.bg, borderRadius: '12px', padding: '20px 24px',
            border: `1px solid ${c.color}20`, boxShadow: '0 2px 8px rgba(61,31,13,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 8px', color: '#8B7355', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {c.label}
                </p>
                <p style={{ margin: 0, color: c.color, fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                  {c.value}
                </p>
                {c.suffix && <p style={{ margin: '4px 0 0', color: '#8B7355', fontSize: '12px' }}>{c.suffix}</p>}
              </div>
              <div style={{ fontSize: '32px' }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tanggal */}
      <div style={{
        background: '#FFFDF8', borderRadius: '12px', padding: '16px 20px',
        marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(61,31,13,0.06)',
      }}>
        <span style={{ color: '#8B7355', fontSize: '13px', fontWeight: 'bold' }}>🗓️ Filter:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" style={{ ...inputStyle, width: 'auto' }}
            value={filterFrom} onChange={e => setFilterFrom(e.target.value)} />
          <span style={{ color: '#8B7355' }}>s/d</span>
          <input type="date" style={{ ...inputStyle, width: 'auto' }}
            value={filterTo} onChange={e => setFilterTo(e.target.value)} />
        </div>
        {(filterFrom || filterTo) && (
          <button
            onClick={() => { setFilterFrom(''); setFilterTo('') }}
            style={{ padding: '8px 14px', background: '#FEE2E2', border: 'none', borderRadius: '6px', color: '#DC2626', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* Tabel Transaksi */}
      <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#3D1F0D' }}>
              {['Kode Transaksi', 'Tanggal', 'Produk', 'Jumlah', 'Harga Satuan', 'Total', 'Keterangan'].map(h => (
                <th key={h} style={{ padding: '14px 16px', color: '#C4956A', fontSize: '12px', letterSpacing: '1px', textAlign: 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>⏳ Memuat...</td></tr>
            ) : transaksi.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#8B7355' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
                <p style={{ margin: 0 }}>Belum ada transaksi</p>
              </td></tr>
            ) : transaksi.map((t, i) => (
              <tr key={t.id_transaksi} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                <td style={{ padding: '14px 16px' }}>
                  <code style={{ background: '#F0E8D8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#A0722A', fontWeight: 'bold' }}>
                    {t.kode_transaksi}
                  </code>
                </td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>
                  {new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ margin: '0 0 2px', color: '#3D1F0D', fontSize: '13px', fontWeight: '500' }}>{t.produk.nama_produk}</p>
                  <code style={{ fontSize: '11px', color: '#A0722A' }}>{t.produk.sku}</code>
                </td>
                <td style={{ padding: '14px 16px', color: '#3D1F0D', fontWeight: 'bold' }}>
                  {t.jumlah} <span style={{ fontSize: '12px', color: '#8B7355', fontWeight: 'normal' }}>pcs</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>
                  Rp {Number(t.harga_satuan).toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '14px 16px', color: '#16A34A', fontWeight: 'bold', fontSize: '14px' }}>
                  Rp {Number(t.total_harga).toLocaleString('id-ID')}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>
                  {t.keterangan || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Transaksi */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#F9F3E8', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '520px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
                🧾 Catat Transaksi Penjualan
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Pilih Produk */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>PRODUK *</label>
              <select style={inputStyle} value={form.id_produk} onChange={handleProdukChange}>
                <option value="">-- Pilih Produk --</option>
                {produkList.map(p => (
                  <option key={p.id_produk} value={p.id_produk}>
                    [{p.sku}] {p.nama_produk} — Stok: {p.stok_tersedia} pcs
                  </option>
                ))}
              </select>
            </div>

            {/* Info Produk Terpilih */}
            {selectedProduk && (
              <div style={{ background: '#F0E8D8', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#3D1F0D', fontWeight: 'bold' }}>{selectedProduk.nama_produk}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#8B7355' }}>
                    Stok tersedia: <strong style={{ color: selectedProduk.stok_tersedia > 5 ? '#16A34A' : '#DC2626' }}>{selectedProduk.stok_tersedia} pcs</strong>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#8B7355' }}>Harga</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#A0722A', fontWeight: 'bold' }}>
                    Rp {Number(selectedProduk.harga).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            {/* Jumlah & Harga */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>JUMLAH (pcs) *</label>
                <input type="number" min="1" style={inputStyle}
                  placeholder="1"
                  value={form.jumlah}
                  onChange={e => setForm({ ...form, jumlah: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>HARGA SATUAN (Rp) *</label>
                <input type="number" style={inputStyle}
                  placeholder="1250000"
                  value={form.harga_satuan}
                  onChange={e => setForm({ ...form, harga_satuan: e.target.value })} />
              </div>
            </div>

            {/* Preview Total */}
            {form.jumlah && form.harga_satuan && (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#16A34A', fontSize: '13px', fontWeight: 'bold' }}>💰 Total Penjualan:</span>
                <span style={{ color: '#16A34A', fontSize: '18px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                  Rp {(parseInt(form.jumlah || 0) * parseFloat(form.harga_satuan || 0)).toLocaleString('id-ID')}
                </span>
              </div>
            )}

            {/* Keterangan */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>KETERANGAN</label>
              <input style={inputStyle}
                placeholder="Penjualan langsung / Online / ..."
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
                background: 'linear-gradient(135deg, #16A34A, #22C55E)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '14px', fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>
                {saving ? '⏳ Menyimpan...' : '💾 Catat Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}