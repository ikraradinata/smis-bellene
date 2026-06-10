'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ── Animasi CSS ──────────────────────────────────────────────
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #1a0a02; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.8); opacity: 0; }
    70%  { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes stockPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  }

  .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
  .fade-in-up-1 { animation: fadeInUp 0.6s 0.1s ease both; }
  .fade-in-up-2 { animation: fadeInUp 0.6s 0.2s ease both; }
  .fade-in-up-3 { animation: fadeInUp 0.6s 0.3s ease both; }
  .fade-in-up-4 { animation: fadeInUp 0.6s 0.4s ease both; }
  .fade-in-up-5 { animation: fadeInUp 0.6s 0.5s ease both; }
  .fade-in-up-6 { animation: fadeInUp 0.6s 0.6s ease both; }

  .cta-btn {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .cta-btn:active {
    transform: scale(0.97);
  }
`

// ── Komponen Verifikasi Loading ───────────────────────────────
function VerificationScreen({ onDone }) {
  const [phase, setPhase] = useState('spinning')  // spinning | check | done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('check'), 1800)
    const t2 = setTimeout(() => setPhase('done'),  2800)
    const t3 = setTimeout(() => onDone(),           3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #3D1F0D 0%, #1a0a02 60%, #2A1506 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Grain texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Ring / Check */}
        <div style={{ width: '96px', height: '96px', margin: '0 auto 28px', position: 'relative' }}>
          {phase === 'spinning' && (
            <div style={{
              width: '96px', height: '96px',
              border: '3px solid rgba(196,149,106,0.2)',
              borderTop: '3px solid #C4956A',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite',
            }} />
          )}
          {(phase === 'check' || phase === 'done') && (
            <div style={{
              width: '96px', height: '96px',
              background: 'linear-gradient(135deg, #16A34A, #22C55E)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'badgePop 0.4s ease forwards',
              boxShadow: '0 0 32px rgba(34,197,94,0.4)',
            }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  d="M10 22 L19 31 L34 14"
                  stroke="white" strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="0"
                  style={{ animation: 'checkDraw 0.4s ease forwards' }}
                />
              </svg>
            </div>
          )}
        </div>

        <p style={{
          color: phase === 'done' ? '#22C55E' : '#C4956A',
          fontSize: '15px', fontWeight: '500', letterSpacing: '0.5px',
          transition: 'color 0.3s',
          animation: phase === 'spinning' ? 'pulse 1.5s infinite' : 'none',
        }}>
          {phase === 'spinning' ? 'Memverifikasi keaslian produk...' :
           phase === 'check'    ? 'Produk terverifikasi!' :
                                  'Membuka Paspor Digital...'}
        </p>

        <p style={{ color: 'rgba(196,149,106,0.5)', fontSize: '12px', marginTop: '12px', letterSpacing: '1px' }}>
          BELLENE LEATHER · GARUT
        </p>
      </div>
    </div>
  )
}

// ── Komponen Utama Paspor Digital ────────────────────────────
function PassportContent() {
  const searchParams = useSearchParams()
  const sku = searchParams.get('sku')

  const [verified, setVerified] = useState(false)
  const [data, setData]         = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (!sku || fetched.current) return
    fetched.current = true
    fetch(`/api/public/story?sku=${sku}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then(d => { if (d) setData(d) })
      .catch(() => setNotFound(true))
  }, [sku])

  // ── 404 Page ──
  if (notFound) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #3D1F0D 0%, #1a0a02 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
      <h2 style={{ color: '#F9F3E8', fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '8px' }}>
        Produk Tidak Terdaftar
      </h2>
      <p style={{ color: '#A0722A', fontSize: '14px', marginBottom: '8px' }}>
        SKU <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{sku}</code> tidak ditemukan dalam sistem.
      </p>
      <p style={{ color: 'rgba(196,149,106,0.6)', fontSize: '12px' }}>
        Pastikan Anda memindai QR Code asli dari produk Bellene Leather.
      </p>
    </div>
  )

  // ── Verification Screen ──
  if (!verified) return <VerificationScreen onDone={() => setVerified(true)} />

  // ── Loading data ──
  if (!data) return (
    <div style={{
      minHeight: '100vh', background: '#1a0a02',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ color: '#A0722A', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
        Memuat data produk...
      </div>
    </div>
  )

  const { produk, story, pengrajin, stok_tersedia } = data

  const stokStatus = stok_tersedia === 0
    ? { label: 'Stok Habis', color: '#DC2626', bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.3)', dot: '#DC2626' }
    : stok_tersedia < 10
    ? { label: `Terbatas — Sisa ${stok_tersedia} pcs`, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', dot: '#F59E0B' }
    : { label: `Tersedia — ${stok_tersedia} pcs`, color: '#22C55E', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', dot: '#22C55E' }

  const tipsList = story.tips_perawatan
    .split('\n')
    .filter(t => t.trim())

  return (
    <>
      <style>{styleTag}</style>
      <div style={{
        maxWidth: '430px', margin: '0 auto',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #2A1506 0%, #1a0a02 40%, #0f0501 100%)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grain Texture Overlay */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(160,114,42,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── HEADER ── */}
          <div className="fade-in-up" style={{
            padding: '48px 24px 32px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(160,114,42,0.15)',
          }}>
            {/* Verified Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '20px', padding: '5px 14px',
              marginBottom: '20px',
              animation: 'badgePop 0.5s 0.2s ease both',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', animation: 'stockPulse 2s infinite' }} />
              <span style={{ color: '#22C55E', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
                KEASLIAN 100% TERJAMIN
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#F9F3E8',
              fontSize: '26px',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '8px',
            }}>
              {produk.nama_produk}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <code style={{
                background: 'rgba(160,114,42,0.2)', border: '1px solid rgba(160,114,42,0.3)',
                color: '#C4956A', padding: '3px 10px', borderRadius: '6px',
                fontSize: '12px', fontWeight: '600',
              }}>
                {produk.sku}
              </code>
              <span style={{
                background: 'rgba(196,149,106,0.15)', color: '#C4956A',
                padding: '3px 10px', borderRadius: '6px', fontSize: '11px',
              }}>
                Bellene Leather
              </span>
            </div>

            {/* Shimmer Price */}
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #A0722A, #C4956A, #E8C48A, #C4956A, #A0722A)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
              fontSize: '22px',
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700',
            }}>
              Rp {Number(produk.harga).toLocaleString('id-ID')}
            </div>
          </div>

          {/* ── STOK DISPLAY ── */}
          <div className="fade-in-up-1" style={{ padding: '20px 24px 0' }}>
            <div style={{
              background: stokStatus.bg,
              border: `1px solid ${stokStatus.border}`,
              borderRadius: '12px', padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: stokStatus.dot,
                animation: stok_tersedia > 0 ? 'stockPulse 2s infinite' : 'none',
              }} />
              <div>
                <p style={{ margin: 0, color: stokStatus.color, fontSize: '13px', fontWeight: '600' }}>
                  {stokStatus.label}
                </p>
                <p style={{ margin: 0, color: 'rgba(196,149,106,0.6)', fontSize: '11px' }}>
                  Status ketersediaan real-time
                </p>
              </div>
            </div>
          </div>

          {/* ── MATERIAL PASSPORT ── */}
          <div className="fade-in-up-2" style={{ padding: '20px 24px 0' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(160,114,42,0.2)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(160,114,42,0.1)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>🪪</span>
                <span style={{ color: '#C4956A', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px' }}>
                  PASPOR MATERIAL
                </span>
              </div>

              <div style={{ padding: '4px 0' }}>
                {[
                  { icon: '🐑', label: 'Jenis Kulit',        value: produk.jenis_kulit },
                  { icon: '📍', label: 'Asal Material',      value: produk.asal_material },
                  { icon: '⚗️', label: 'Teknik Penyamakan',  value: produk.teknik_penyamakan === 'Vegetable' ? 'Vegetable Tanning' : 'Chrome Tanning' },
                  { icon: '🎨', label: 'Warna',              value: produk.warna },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '13px 18px',
                    borderBottom: i < 3 ? '1px solid rgba(160,114,42,0.07)' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      <span style={{ color: 'rgba(196,149,106,0.6)', fontSize: '12px' }}>{item.label}</span>
                    </div>
                    <span style={{ color: '#F9F3E8', fontSize: '13px', fontWeight: '500', textAlign: 'right', maxWidth: '55%' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Teknik Badge */}
              <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(160,114,42,0.1)', display: 'flex', gap: '8px' }}>
                <div style={{
                  flex: 1, background: produk.teknik_penyamakan === 'Vegetable'
                    ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)',
                  border: `1px solid ${produk.teknik_penyamakan === 'Vegetable' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                  borderRadius: '8px', padding: '10px',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '16px' }}>
                    {produk.teknik_penyamakan === 'Vegetable' ? '🌿' : '🔬'}
                  </p>
                  <p style={{ margin: 0, color: produk.teknik_penyamakan === 'Vegetable' ? '#22C55E' : '#60A5FA', fontSize: '11px', fontWeight: '600' }}>
                    {produk.teknik_penyamakan === 'Vegetable' ? 'Natural & Eco-friendly' : 'Chrome Tanned'}
                  </p>
                </div>
                <div style={{
                  flex: 1, background: 'rgba(160,114,42,0.12)',
                  border: '1px solid rgba(160,114,42,0.3)',
                  borderRadius: '8px', padding: '10px', textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '16px' }}>✅</p>
                  <p style={{ margin: 0, color: '#C4956A', fontSize: '11px', fontWeight: '600' }}>
                    Kulit Asli Garut
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── DESKRIPSI PRODUK ── */}
          <div className="fade-in-up-3" style={{ padding: '20px 24px 0' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(160,114,42,0.2)',
              borderRadius: '16px', padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>📖</span>
                <span style={{ color: '#C4956A', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px' }}>
                  TENTANG PRODUK INI
                </span>
              </div>
              <p style={{ color: 'rgba(249,243,232,0.8)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                {story.deskripsi_produk}
              </p>
            </div>
          </div>

          {/* ── NARASI BUDAYA ── */}
          <div className="fade-in-up-3" style={{ padding: '16px 24px 0' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(61,31,13,0.6), rgba(42,21,6,0.8))',
              border: '1px solid rgba(160,114,42,0.25)',
              borderRadius: '16px', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>🏛️</span>
                <span style={{ color: '#C4956A', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px' }}>
                  WARISAN BUDAYA GARUT
                </span>
              </div>

              {/* Decorative quote mark */}
              <div style={{ color: 'rgba(160,114,42,0.3)', fontSize: '48px', fontFamily: 'Georgia', lineHeight: '1', marginBottom: '-8px' }}>
                "
              </div>
              <p style={{
                color: 'rgba(249,243,232,0.85)', fontSize: '14px',
                lineHeight: '1.8', fontStyle: 'italic',
                fontFamily: "'Playfair Display', serif",
                margin: '0 0 4px',
              }}>
                {story.narasi_budaya}
              </p>
              <div style={{ color: 'rgba(160,114,42,0.3)', fontSize: '48px', fontFamily: 'Georgia', lineHeight: '0.5', textAlign: 'right' }}>
                "
              </div>

              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(160,114,42,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px' }}>📍</span>
                <span style={{ color: 'rgba(196,149,106,0.6)', fontSize: '11px' }}>
                  Sukaregang, Garut, Jawa Barat — Pusat Kerajinan Kulit Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* ── PROFIL PENGRAJIN ── */}
          {pengrajin && (
            <div className="fade-in-up-4" style={{ padding: '16px 24px 0' }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(160,114,42,0.2)',
                borderRadius: '16px', padding: '18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px' }}>👨‍🎨</span>
                  <span style={{ color: '#C4956A', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px' }}>
                    DIBUAT OLEH
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '56px', height: '56px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #A0722A, #C4956A)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(160,114,42,0.3)',
                  }}>
                    👨‍🔧
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', color: '#F9F3E8', fontSize: '15px', fontWeight: '600', fontFamily: "'Playfair Display', serif" }}>
                      {pengrajin.nama_pengrajin}
                    </p>
                    <p style={{ margin: '0 0 6px', color: '#C4956A', fontSize: '12px' }}>
                      {pengrajin.nama_bengkel}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(160,114,42,0.15)', color: '#C4956A', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                        ⭐ {pengrajin.tahun_pengalaman} thn
                      </span>
                      <span style={{ background: 'rgba(160,114,42,0.15)', color: '#C4956A', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                        🎯 {pengrajin.spesialisasi}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filosofi */}
                <div style={{
                  marginTop: '14px', padding: '12px 14px',
                  background: 'rgba(160,114,42,0.08)',
                  borderLeft: '3px solid #A0722A',
                  borderRadius: '0 8px 8px 0',
                }}>
                  <p style={{ margin: 0, color: 'rgba(249,243,232,0.75)', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{pengrajin.filosofi_desain}"
                  </p>
                </div>

                <p style={{ margin: '10px 0 0', color: 'rgba(196,149,106,0.5)', fontSize: '11px' }}>
                  📍 {pengrajin.lokasi}
                </p>
              </div>
            </div>
          )}

          {/* ── TIPS PERAWATAN ── */}
          <div className="fade-in-up-5" style={{ padding: '16px 24px 0' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(160,114,42,0.2)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              <button
                onClick={() => setShowTips(!showTips)}
                className="cta-btn"
                style={{
                  width: '100%', padding: '16px 18px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🧴</span>
                  <span style={{ color: '#C4956A', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px' }}>
                    TIPS PERAWATAN
                  </span>
                </div>
                <span style={{ color: '#C4956A', fontSize: '18px', transition: 'transform 0.3s', transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ⌄
                </span>
              </button>

              {showTips && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(160,114,42,0.1)' }}>
                  <div style={{ paddingTop: '14px' }}>
                    {tipsList.map((tip, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        marginBottom: i < tipsList.length - 1 ? '10px' : 0,
                      }}>
                        <div style={{
                          width: '20px', height: '20px', flexShrink: 0,
                          background: 'rgba(160,114,42,0.2)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#C4956A', fontSize: '10px', fontWeight: '700',
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ margin: 0, color: 'rgba(249,243,232,0.8)', fontSize: '13px', lineHeight: '1.6' }}>
                          {tip.replace(/^\d+\.\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CTA BUTTONS ── */}
          <div className="fade-in-up-6" style={{ padding: '20px 24px 48px' }}>

            {/* Instagram CTA */}
            <a
              href="https://instagram.com/bellene.leather"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
                borderRadius: '12px', marginBottom: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(131,58,180,0.3)',
              }}>
              <span style={{ fontSize: '20px' }}>📸</span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                Ikuti @bellene.leather
              </span>
            </a>

            {/* Tips Download CTA */}
            <button
              onClick={() => setShowTips(true)}
              className="cta-btn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                width: '100%', padding: '16px',
                background: 'rgba(160,114,42,0.15)',
                border: '1px solid rgba(160,114,42,0.3)',
                borderRadius: '12px', marginBottom: '10px',
                cursor: 'pointer',
              }}>
              <span style={{ fontSize: '20px' }}>🧴</span>
              <span style={{ color: '#C4956A', fontWeight: '600', fontSize: '14px' }}>
                Lihat Tips Perawatan
              </span>
            </button>

            {/* Google Review CTA */}
            <button
              className="cta-btn"
              onClick={() => alert('Fitur ulasan akan segera hadir!')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                width: '100%', padding: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <span style={{ color: 'rgba(249,243,232,0.7)', fontWeight: '600', fontSize: '14px' }}>
                Beri Ulasan Produk
              </span>
            </button>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(160,114,42,0.1)',
                border: '1px solid rgba(160,114,42,0.2)',
                borderRadius: '20px', padding: '6px 14px',
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '12px' }}>🏷️</span>
                <span style={{ color: '#A0722A', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
                  BELLENE LEATHER GARUT
                </span>
              </div>
              <p style={{ color: 'rgba(160,114,42,0.4)', fontSize: '10px', letterSpacing: '0.5px' }}>
                Paspor Digital · Hibah PkM 2025 · BINUS University
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

// ── Export dengan Suspense (wajib untuk useSearchParams) ──────
export default function StoryPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#1a0a02',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#A0722A', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          ⏳ Memuat...
        </div>
      </div>
    }>
      <PassportContent />
    </Suspense>
  )
}