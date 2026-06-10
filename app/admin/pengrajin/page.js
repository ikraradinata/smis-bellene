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

const ConfirmDeleteModal = ({ nama, onCancel, onConfirm, loading, error }) => (
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
        Hapus Pengrajin?
      </h2>
      <p style={{ margin: '0 0 16px', color: '#8B7355', fontSize: '14px', lineHeight: 1.5 }}>
        Apakah Anda yakin ingin menghapus pengrajin <strong style={{ color: '#3D1F0D' }}>{nama}</strong>?
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
    nama_pengrajin: '',
    nama_bengkel: '',
    tahun_pengalaman: '',
    spesialisasi: '',
    filosofi_desain: '',
    foto_url: '',
    lokasi: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const url = editData ? `/api/pengrajin/${editData.id_pengrajin}` : '/api/pengrajin'
      const method = editData ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#F9F3E8', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '20px' }}>
            {editData ? '✏️ Edit Pengrajin' : '➕ Tambah Pengrajin Baru'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>NAMA PENGRAJIN *</label>
            <input style={inputStyle} placeholder="Pak Asep Kurniawan" value={form.nama_pengrajin}
              onChange={e => setForm({ ...form, nama_pengrajin: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>NAMA BENGKEL *</label>
            <input style={inputStyle} placeholder="Bengkel Kulit Asep Putra" value={form.nama_bengkel}
              onChange={e => setForm({ ...form, nama_bengkel: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>TAHUN PENGALAMAN *</label>
            <input style={inputStyle} type="number" min="0" placeholder="25" value={form.tahun_pengalaman}
              onChange={e => setForm({ ...form, tahun_pengalaman: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>LOKASI *</label>
            <input style={inputStyle} placeholder="Sukaregang, Garut, Jawa Barat" value={form.lokasi}
              onChange={e => setForm({ ...form, lokasi: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>SPESIALISASI</label>
            <input style={inputStyle} placeholder="Jaket dan Tas Kulit Domba" value={form.spesialisasi}
              onChange={e => setForm({ ...form, spesialisasi: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>FILOSOFI DESAIN</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Setiap jahitan adalah doa..."
              value={form.filosofi_desain}
              onChange={e => setForm({ ...form, filosofi_desain: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>URL FOTO (opsional)</label>
            <input style={inputStyle} placeholder="https://..." value={form.foto_url || ''}
              onChange={e => setForm({ ...form, foto_url: e.target.value })} />
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
            borderRadius: '8px', color: '#8B7355', cursor: 'pointer', fontSize: '14px',
          }}>Batal</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            border: 'none', borderRadius: '8px', color: '#F9F3E8',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold',
          }}>
            {loading ? '⏳ Menyimpan...' : '💾 Simpan Pengrajin'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PengrajinPage() {
  const [pengrajin, setPengrajin] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchPengrajin = () => {
    setLoading(true)
    fetch('/api/pengrajin')
      .then(r => r.json())
      .then(d => { setPengrajin(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchPengrajin() }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/pengrajin/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengrajin')
      setDeleteTarget(null)
      fetchPengrajin()
    } catch (e) {
      setDeleteError(e.message)
    }
    setDeleteLoading(false)
  }

  const filtered = pengrajin.filter(p => {
    const q = search.toLowerCase()
    return p.nama_pengrajin.toLowerCase().includes(q) ||
      p.nama_bengkel.toLowerCase().includes(q) ||
      p.lokasi.toLowerCase().includes(q) ||
      (p.spesialisasi || '').toLowerCase().includes(q)
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Master Pengrajin
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            {pengrajin.length} pengrajin terdaftar
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
          ➕ Tambah Pengrajin
        </button>
      </div>

      <div style={{
        background: '#FFFDF8', borderRadius: '12px', padding: '16px 20px',
        marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(61,31,13,0.06)',
      }}>
        <input
          placeholder="🔍 Cari nama, bengkel, lokasi, atau spesialisasi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, maxWidth: '480px' }}
        />
      </div>

      <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#3D1F0D' }}>
              {['Nama Pengrajin', 'Bengkel', 'Pengalaman', 'Lokasi', 'Spesialisasi', 'Story', 'Aksi'].map(h => (
                <th key={h} style={{
                  padding: '14px 16px', color: '#C4956A', fontSize: '12px',
                  letterSpacing: '1px', textAlign: 'left', fontFamily: 'Inter, sans-serif',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>⏳ Memuat...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>Belum ada pengrajin</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id_pengrajin} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                <td style={{ padding: '14px 16px', color: '#3D1F0D', fontSize: '14px', fontWeight: '500' }}>
                  {p.nama_pengrajin}
                </td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>{p.nama_bengkel}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#EDD9B5', color: '#5C3317', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {p.tahun_pengalaman} tahun
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>{p.lokasi}</td>
                <td style={{ padding: '14px 16px', color: '#8B7355', fontSize: '13px' }}>{p.spesialisasi || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: p.jumlah_story > 0 ? '#F0FDF4' : '#F5F5F5',
                    color: p.jumlah_story > 0 ? '#16A34A' : '#8B7355',
                    padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                  }}>
                    {p.jumlah_story} story
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setEditData(p); setShowModal(true) }}
                      style={{ padding: '6px 12px', background: '#EDD9B5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#5C3317', fontWeight: 'bold' }}>
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => { setDeleteError(''); setDeleteTarget({ id: p.id_pengrajin, nama: p.nama_pengrajin }) }}
                      style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#DC2626', fontWeight: 'bold' }}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <FormModal
          editData={editData}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchPengrajin() }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
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
