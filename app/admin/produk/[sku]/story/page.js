'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

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

export default function StoryPage() {
  const { sku } = useParams()
  const router = useRouter()
  const [story, setStory] = useState(null)
  const [pengrajinList, setPengrajinList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [generatingQR, setGeneratingQR] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({
    id_pengrajin: '',
    deskripsi_produk: '',
    narasi_budaya: '',
    tips_perawatan: '',
    is_published: false,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/story?sku=${sku}`).then(r => r.json()),
      fetch('/api/pengrajin').then(r => r.json()),
    ]).then(([storyData, pengrajinData]) => {
      setStory(storyData)
      setPengrajinList(pengrajinData)
      if (storyData) {
        setForm({
          id_pengrajin: storyData.id_pengrajin?.toString() || '',
          deskripsi_produk: storyData.deskripsi_produk || '',
          narasi_budaya: storyData.narasi_budaya || '',
          tips_perawatan: storyData.tips_perawatan || '',
          is_published: storyData.is_published || false,
        })
      }
      setLoading(false)
    })
  }, [sku])

  const handleSave = async () => {
    setSaving(true)
    setSuccessMsg('')
    await fetch('/api/story', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_story: story.id_story, ...form })
    })
    setSaving(false)
    setSuccessMsg('✅ Story berhasil disimpan!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleGenerateQR = async () => {
    setGeneratingQR(true)
    const res = await fetch('/api/qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku })
    })
    const data = await res.json()
    setQrData(data)
    setGeneratingQR(false)
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrData.qrBase64
    link.download = `QR-${sku}.png`
    link.click()
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#A0722A' }}>
      ⏳ Memuat data story...
    </div>
  )

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => router.push('/admin/produk')}
          style={{ background: '#EDD9B5', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', color: '#5C3317', fontWeight: 'bold' }}>
          ← Kembali
        </button>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            User Story — {sku}
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            {story?.produk?.nama_produk}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: form.is_published ? '#F0FDF4' : '#FEF3C7',
            color: form.is_published ? '#16A34A' : '#D97706',
            fontSize: '12px', fontWeight: 'bold',
          }}>
            {form.is_published ? '✅ Published' : '⏸️ Draft'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        {/* Form Story */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Pengrajin */}
          <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              👨‍🎨 Profil Pengrajin
            </h3>
            <label style={labelStyle}>PILIH PENGRAJIN</label>
            <select
              style={inputStyle}
              value={form.id_pengrajin}
              onChange={e => setForm({ ...form, id_pengrajin: e.target.value })}>
              <option value="">-- Pilih Pengrajin --</option>
              {pengrajinList.map(p => (
                <option key={p.id_pengrajin} value={p.id_pengrajin}>
                  {p.nama_pengrajin} — {p.nama_bengkel}
                </option>
              ))}
            </select>

            {form.id_pengrajin && pengrajinList.find(p => p.id_pengrajin === parseInt(form.id_pengrajin)) && (
              <div style={{ marginTop: '16px', padding: '16px', background: '#F9F3E8', borderRadius: '8px', border: '1px solid #E8DCC8' }}>
                {(() => {
                  const p = pengrajinList.find(x => x.id_pengrajin === parseInt(form.id_pengrajin))
                  return (
                    <>
                      <p style={{ margin: '0 0 6px', color: '#3D1F0D', fontWeight: 'bold', fontSize: '14px' }}>{p.nama_pengrajin}</p>
                      <p style={{ margin: '0 0 4px', color: '#8B7355', fontSize: '13px' }}>🏭 {p.nama_bengkel}</p>
                      <p style={{ margin: '0 0 4px', color: '#8B7355', fontSize: '13px' }}>⭐ {p.tahun_pengalaman} tahun pengalaman</p>
                      <p style={{ margin: '0 0 4px', color: '#8B7355', fontSize: '13px' }}>📍 {p.lokasi}</p>
                      <p style={{ margin: '8px 0 0', color: '#5C3317', fontSize: '13px', fontStyle: 'italic' }}>"{p.filosofi_desain}"</p>
                    </>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Deskripsi Produk */}
          <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              📝 Narasi Produk
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>DESKRIPSI PRODUK</label>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                placeholder="Deskripsikan produk secara detail..."
                value={form.deskripsi_produk}
                onChange={e => setForm({ ...form, deskripsi_produk: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>NARASI BUDAYA</label>
              <textarea
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder="Ceritakan nilai budaya dan sejarah di balik produk ini..."
                value={form.narasi_budaya}
                onChange={e => setForm({ ...form, narasi_budaya: e.target.value })}
              />
            </div>
          </div>

          {/* Tips Perawatan */}
          <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              🧴 Tips Perawatan
            </h3>
            <textarea
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="1. Simpan di tempat kering&#10;2. Bersihkan dengan kain lembab&#10;3. ..."
              value={form.tips_perawatan}
              onChange={e => setForm({ ...form, tips_perawatan: e.target.value })}
            />
          </div>

          {/* Publish Toggle & Save */}
          <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px', color: '#3D1F0D', fontWeight: 'bold', fontSize: '14px' }}>
                  Publish ke Halaman Konsumen
                </p>
                <p style={{ margin: 0, color: '#8B7355', fontSize: '12px' }}>
                  Story akan tampil saat konsumen scan QR Code
                </p>
              </div>
              <button
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
                style={{
                  width: '52px', height: '28px',
                  background: form.is_published ? '#A0722A' : '#D4C4B0',
                  border: 'none', borderRadius: '14px', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                }}>
                <div style={{
                  width: '22px', height: '22px', background: 'white', borderRadius: '50%',
                  position: 'absolute', top: '3px',
                  left: form.is_published ? '27px' : '3px',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {successMsg && (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#16A34A', fontSize: '13px' }}>
                {successMsg}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #A0722A, #C4956A)',
                border: 'none', borderRadius: '8px', color: '#F9F3E8',
                fontSize: '15px', fontWeight: 'bold', fontFamily: 'Georgia, serif',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Story'}
            </button>
          </div>
        </div>

        {/* QR Code Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              📱 QR Code Produk
            </h3>

            {qrData ? (
              <>
                <img src={qrData.qrBase64} alt="QR Code" style={{ width: '200px', height: '200px', borderRadius: '8px', border: '4px solid #E8DCC8' }} />
                <p style={{ margin: '12px 0 4px', color: '#8B7355', fontSize: '11px', wordBreak: 'break-all' }}>
                  {qrData.storyUrl}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={handleDownloadQR}
                    style={{
                      flex: 1, padding: '10px',
                      background: 'linear-gradient(135deg, #A0722A, #C4956A)',
                      border: 'none', borderRadius: '8px', color: '#F9F3E8',
                      fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
                    }}>
                    ⬇️ Download PNG
                  </button>
                  <button
                    onClick={() => window.open(`/story?sku=${sku}`, '_blank')}
                    style={{
                      flex: 1, padding: '10px',
                      background: '#EDD9B5', border: 'none', borderRadius: '8px',
                      color: '#5C3317', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
                    }}>
                    👁️ Preview
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: '200px', height: '200px', margin: '0 auto 16px',
                  background: '#F0E8D8', borderRadius: '8px',
                  border: '2px dashed #C4956A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '8px',
                }}>
                  <span style={{ fontSize: '48px' }}>📱</span>
                  <span style={{ color: '#A0722A', fontSize: '12px' }}>QR Code belum digenerate</span>
                </div>
                <button
                  onClick={handleGenerateQR}
                  disabled={generatingQR}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'linear-gradient(135deg, #3D1F0D, #6B3A2A)',
                    border: 'none', borderRadius: '8px', color: '#F9F3E8',
                    fontSize: '14px', fontWeight: 'bold', cursor: generatingQR ? 'not-allowed' : 'pointer',
                  }}>
                  {generatingQR ? '⏳ Generating...' : '⚡ Generate QR Code'}
                </button>
              </>
            )}
          </div>

          {/* Info Card */}
          <div style={{ background: '#FDF8F0', borderRadius: '12px', padding: '20px', border: '1px solid #E8DCC8' }}>
            <h4 style={{ margin: '0 0 12px', color: '#3D1F0D', fontSize: '14px', fontFamily: 'Georgia, serif' }}>
              ℹ️ Cara Penggunaan QR
            </h4>
            <ol style={{ margin: 0, paddingLeft: '16px', color: '#8B7355', fontSize: '12px', lineHeight: '1.8' }}>
              <li>Isi & simpan narasi story</li>
              <li>Klik Generate QR Code</li>
              <li>Download file PNG</li>
              <li>Cetak & tempel di hangtag produk</li>
              <li>Konsumen scan → lihat Paspor Digital</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}