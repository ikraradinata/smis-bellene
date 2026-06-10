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

const ConfirmDeleteModal = ({ sku, nama, onCancel, onConfirm, loading, error }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }}>
    <div style={{
      background: '#F9F3E8', borderRadius: '16px', padding: '32px',
      width: '100%', maxWidth: '420px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    }}>
      <h2 style={{ margin: '0 0 12px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
        Hapus Produk?
      </h2>
      <p style={{ margin: '0 0 16px', color: '#8B7355', fontSize: '14px', lineHeight: 1.5 }}>
        Apakah Anda yakin ingin menghapus produk{' '}
        <strong style={{ color: '#3D1F0D' }}>{sku}</strong>
        {' — '}
        <strong style={{ color: '#3D1F0D' }}>{nama}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </p>
      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: '10px 20px', background: 'transparent', border: '2px solid #E8DCC8',
            borderRadius: '8px', color: '#8B7355', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px',
          }}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '10px 24px', background: '#DC2626', border: 'none', borderRadius: '8px',
            color: '#FFF', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold',
          }}
        >
          {loading ? '⏳ Menghapus...' : '🗑️ Ya, Hapus'}
        </button>
      </div>
    </div>
  </div>
)

const FormModal = ({ onClose, onSave, editData }) => {
  const [form, setForm] = useState(editData || {
    sku: '', nama_produk: '', jenis_kulit: 'Domba',
    asal_material: '', teknik_penyamakan: 'Vegetable',
    warna: '', harga: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const url = editData ? `/api/produk/${editData.id_produk}` : '/api/produk'
      const method = editData ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')
      onSave()
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#F9F3E8', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
            {editData ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {!editData && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>SKU *</label>
              <input style={inputStyle} placeholder="JKT-002" value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })} />
            </div>
          )}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>NAMA PRODUK *</label>
            <input style={inputStyle} placeholder="Jaket Kulit Domba..." value={form.nama_produk}
              onChange={e => setForm({ ...form, nama_produk: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>JENIS KULIT *</label>
            <select style={inputStyle} value={form.jenis_kulit}
              onChange={e => setForm({ ...form, jenis_kulit: e.target.value })}>
              <option value="Domba">Domba</option>
              <option value="Sapi">Sapi</option>
              <option value="Kerbau">Kerbau</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>TEKNIK PENYAMAKAN *</label>
            <select style={inputStyle} value={form.teknik_penyamakan}
              onChange={e => setForm({ ...form, teknik_penyamakan: e.target.value })}>
              <option value="Vegetable">Vegetable Tanning</option>
              <option value="Chrome">Chrome Tanning</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>ASAL MATERIAL *</label>
            <input style={inputStyle} placeholder="Domba Priangan, Garut, Jawa Barat" value={form.asal_material}
              onChange={e => setForm({ ...form, asal_material: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>WARNA *</label>
            <input style={inputStyle} placeholder="Cokelat Tua" value={form.warna}
              onChange={e => setForm({ ...form, warna: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>HARGA (Rp) *</label>
            <input style={inputStyle} type="number" placeholder="1250000" value={form.harga}
              onChange={e => setForm({ ...form, harga: e.target.value })} />
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px', marginTop: '16px', color: '#DC2626', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', background: 'transparent', border: '2px solid #E8DCC8',
            borderRadius: '8px', color: '#8B7355', cursor: 'pointer', fontSize: '14px'
          }}>Batal</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            border: 'none', borderRadius: '8px', color: '#F9F3E8',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold'
          }}>
            {loading ? '⏳ Menyimpan...' : '💾 Simpan Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProdukPage() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [filterKulit, setFilterKulit] = useState('Semua')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchProduk = () => {
    setLoading(true)
    fetch('/api/produk')
      .then(r => r.json())
      .then(d => { setProduk(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProduk() }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/produk/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus produk')
      setDeleteTarget(null)
      fetchProduk()
    } catch (e) {
      setDeleteError(e.message)
    }
    setDeleteLoading(false)
  }

  const filtered = produk.filter(p => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filterKulit === 'Semua' || p.jenis_kulit === filterKulit
    return matchSearch && matchFilter
  })

  const statusStok = (stok) => {
    if (stok === 0) return { label: 'Habis', color: '#DC2626', bg: '#FEE2E2' }
    if (stok < 5) return { label: 'Kritis', color: '#D97706', bg: '#FEF3C7' }
    return { label: 'Aman', color: '#16A34A', bg: '#F0FDF4' }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Master Produk
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            {produk.length} produk terdaftar
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true) }}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            border: 'none', borderRadius: '8px', color: '#F9F3E8',
            cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
          }}>
          ➕ Tambah Produk
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#FFFDF8', borderRadius: '12px', padding: '16px 20px',
        marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(61,31,13,0.06)'
      }}>
        <input
          placeholder="🔍 Cari nama produk atau SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, maxWidth: '360px' }}
        />
        {['Semua', 'Domba', 'Sapi', 'Kerbau'].map(k => (
          <button key={k} onClick={() => setFilterKulit(k)} style={{
            padding: '8px 16px',
            background: filterKulit === k ? '#A0722A' : 'transparent',
            color: filterKulit === k ? '#F9F3E8' : '#8B7355',
            border: `2px solid ${filterKulit === k ? '#A0722A' : '#E8DCC8'}`,
            borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
            fontWeight: filterKulit === k ? 'bold' : 'normal',
          }}>{k}</button>
        ))}
      </div>

      {/* Tabel Produk */}
      <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#3D1F0D' }}>
              {['SKU', 'Nama Produk', 'Jenis Kulit', 'Teknik', 'Harga', 'Stok', 'Story', 'Aksi'].map(h => (
                <th key={h} style={{
                  padding: '14px 16px', color: '#C4956A', fontSize: '12px',
                  letterSpacing: '1px', textAlign: 'left', fontFamily: 'Inter, sans-serif'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>⏳ Memuat...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>Belum ada produk</td></tr>
            ) : filtered.map((p, i) => {
              const stok = statusStok(p.stok_tersedia)
              return (
                <tr key={p.id_produk} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <code style={{ background: '#F0E8D8', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#A0722A', fontWeight: 'bold' }}>
                      {p.sku}
                    </code>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#3D1F0D', fontSize: '14px', fontWeight: '500' }}>{p.nama_produk}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#EDD9B5', color: '#5C3317', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {p.jenis_kulit}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>{p.teknik_penyamakan}</td>
                  <td style={{ padding: '14px 16px', color: '#3D1F0D', fontSize: '14px', fontWeight: 'bold' }}>
                    Rp {Number(p.harga).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: stok.bg, color: stok.color, padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {stok.label} ({p.stok_tersedia})
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '18px' }}>{p.has_story ? '✅' : '❌'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => window.location.href = `/admin/produk/${p.sku}/story`}
                        style={{ padding: '6px 12px', background: '#EDE9FE', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#7C3AED', fontWeight: 'bold' }}>
                        📖 Story
                      </button>
                      <button
                        onClick={() => { setEditData(p); setShowModal(true) }}
                        style={{ padding: '6px 12px', background: '#EDD9B5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#5C3317', fontWeight: 'bold' }}>
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => { setDeleteError(''); setDeleteTarget({ id: p.id_produk, sku: p.sku, nama: p.nama_produk }) }}
                        style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#DC2626', fontWeight: 'bold' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <FormModal
          editData={editData}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchProduk() }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          sku={deleteTarget.sku}
          nama={deleteTarget.nama}
          loading={deleteLoading}
          error={deleteError}
          onCancel={() => { if (!deleteLoading) setDeleteTarget(null) }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}