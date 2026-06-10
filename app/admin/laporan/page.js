'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'

const inputStyle = {
  padding: '9px 14px',
  border: '2px solid #E8DCC8',
  borderRadius: '8px',
  background: '#FFFDF8',
  color: '#3D1F0D',
  fontSize: '13px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
}

const statusColor = {
  Aman:   { color: '#16A34A', bg: '#F0FDF4' },
  Kritis: { color: '#D97706', bg: '#FEF3C7' },
  Habis:  { color: '#DC2626', bg: '#FEE2E2' },
}

// ── Export CSV helper ─────────────────────────────────────────
function exportCSV(rows, filename) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(r =>
      headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Kartu KPI ─────────────────────────────────────────────────
const KPI = ({ icon, label, value, sub, color, bg }) => (
  <div style={{
    background: bg || '#FFFDF8',
    borderRadius: '12px', padding: '20px 22px',
    borderLeft: `4px solid ${color}`,
    boxShadow: '0 2px 8px rgba(61,31,13,0.07)',
    flex: 1, minWidth: '160px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <p style={{ margin: '0 0 6px', color: '#8B7355', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: '0 0 3px', color: '#3D1F0D', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>{value}</p>
        {sub && <p style={{ margin: 0, color: '#A0722A', fontSize: '11px' }}>{sub}</p>}
      </div>
      <div style={{ fontSize: '28px', alignSelf: 'flex-start' }}>{icon}</div>
    </div>
  </div>
)

export default function LaporanPage() {
  const today  = new Date().toISOString().slice(0, 10)
  const month1 = new Date(new Date().setDate(1)).toISOString().slice(0, 10)

  const [from, setFrom]       = useState(month1)
  const [to,   setTo]         = useState(today)
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('transaksi')

  const fetchLaporan = async () => {
    setLoading(true)
    const res  = await fetch(`/api/laporan?from=${from}&to=${to}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { fetchLaporan() }, [])

  const handleFilter = () => fetchLaporan()

  const handleExportTransaksi = () => {
    const rows = (data?.transaksi || []).map(t => ({
      Kode:        t.kode_transaksi,
      Tanggal:     new Date(t.tanggal_transaksi).toLocaleDateString('id-ID'),
      SKU:         t.produk.sku,
      Produk:      t.produk.nama_produk,
      Jumlah:      t.jumlah,
      Harga_Satuan: t.harga_satuan,
      Total:       t.total_harga,
      Keterangan:  t.keterangan || '',
    }))
    exportCSV(rows, `Laporan-Transaksi-${from}-${to}.csv`)
  }

  const handleExportStok = () => {
    const rows = (data?.rekapStok || []).map(s => ({
      SKU:           s.sku,
      Produk:        s.nama_produk,
      Jenis_Kulit:   s.jenis_kulit,
      Harga:         s.harga,
      Total_Masuk:   s.total_masuk,
      Total_Keluar:  s.total_keluar,
      Stok_Tersedia: s.stok_tersedia,
      Nilai_Stok:    s.nilai_stok,
      Status:        s.status,
    }))
    exportCSV(rows, `Rekap-Stok-${today}.csv`)
  }

  const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            Laporan & Analitik
          </h2>
          <p style={{ margin: 0, color: '#8B7355', fontSize: '13px' }}>
            Data terintegrasi seluruh modul SMIS
          </p>
        </div>

        {/* Filter Tanggal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#8B7355', fontSize: '13px' }}>🗓️</span>
          <input type="date" style={inputStyle} value={from} onChange={e => setFrom(e.target.value)} />
          <span style={{ color: '#8B7355', fontSize: '13px' }}>s/d</span>
          <input type="date" style={inputStyle} value={to}   onChange={e => setTo(e.target.value)} />
          <button onClick={handleFilter} style={{
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #A0722A, #C4956A)',
            border: 'none', borderRadius: '8px', color: '#F9F3E8',
            fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
          }}>
            Terapkan
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#A0722A', fontFamily: 'Georgia, serif' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p>Memuat laporan...</p>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <KPI icon="💰" label="Total Pendapatan"   color="#16A34A"
              value={fmt(data.summary.totalPendapatan)} sub={`${data.summary.totalTransaksi} transaksi`} />
            <KPI icon="📦" label="Total Unit Terjual" color="#2563EB"
              value={data.summary.totalUnit} sub="pcs terjual" />
            <KPI icon="🏦" label="Nilai Stok Saat Ini" color="#A0722A"
              value={fmt(data.summary.totalNilaiStok)} sub="estimasi nilai inventori" />
            <KPI icon="📱" label="Total Scan QR"      color="#9333EA"
              value={data.summary.totalScan} sub="scan dalam periode" />
          </div>

          {/* ── Grafik Tren ── */}
          {data.tren.length > 0 && (
            <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                📈 Tren Pendapatan Harian
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.tren}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8B7355' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8B7355' }}
                    tickFormatter={v => v === 0 ? '0' : `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={v => [fmt(v), 'Pendapatan']}
                    contentStyle={{ background: '#FFFDF8', border: '1px solid #E8DCC8', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="pendapatan" fill="#A0722A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Top Produk ── */}
          {data.topProduk.length > 0 && (
            <div style={{ background: '#FFFDF8', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#3D1F0D', fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                🏆 Top Produk Terlaris
              </h3>
              {data.topProduk.map((p, i) => (
                <div key={p.sku} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 0',
                  borderBottom: i < data.topProduk.length - 1 ? '1px solid #F0E8D8' : 'none',
                }}>
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    background: i === 0 ? 'linear-gradient(135deg,#A0722A,#C4956A)'
                               : i === 1 ? 'linear-gradient(135deg,#94A3B8,#CBD5E1)'
                               : i === 2 ? 'linear-gradient(135deg,#B45309,#D97706)'
                               : '#F0E8D8',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i < 3 ? 'white' : '#8B7355',
                    fontWeight: 'bold', fontSize: '13px',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', color: '#3D1F0D', fontSize: '13px', fontWeight: '600' }}>{p.nama_produk}</p>
                    <p style={{ margin: 0, color: '#8B7355', fontSize: '11px' }}>
                      {p.sku} · {p.jenis_kulit}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px', color: '#16A34A', fontWeight: 'bold', fontSize: '14px' }}>
                      {fmt(p.total_pendapatan)}
                    </p>
                    <p style={{ margin: 0, color: '#8B7355', fontSize: '11px' }}>
                      {p.total_unit} pcs terjual
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tabs Detail ── */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#FFFDF8', borderRadius: '10px', padding: '4px', width: 'fit-content', boxShadow: '0 2px 8px rgba(61,31,13,0.06)' }}>
            {[
              { key: 'transaksi', label: '🧾 Detail Transaksi' },
              { key: 'stok',      label: '📦 Rekap Stok'       },
              { key: 'scan',      label: '📱 Log Scan QR'      },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '8px 18px',
                background: tab === t.key ? '#A0722A' : 'transparent',
                color: tab === t.key ? '#F9F3E8' : '#8B7355',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', fontWeight: tab === t.key ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}>{t.label}</button>
            ))}
          </div>

          {/* ── Tab: Detail Transaksi ── */}
          {tab === 'transaksi' && (
            <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0E8D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#3D1F0D', fontWeight: 'bold', fontSize: '14px' }}>
                  {data.transaksi.length} transaksi ditemukan
                </span>
                <button onClick={handleExportTransaksi} style={{
                  padding: '8px 16px',
                  background: '#F0FDF4', border: '1px solid #86EFAC',
                  borderRadius: '8px', color: '#16A34A',
                  fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                }}>
                  ⬇️ Export CSV
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#3D1F0D' }}>
                      {['Kode', 'Tanggal', 'Produk', 'Jml', 'Harga Satuan', 'Total', 'Ket'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', color: '#C4956A', fontSize: '11px', letterSpacing: '1px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.transaksi.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>Tidak ada transaksi dalam periode ini</td></tr>
                    ) : data.transaksi.map((t, i) => (
                      <tr key={t.id_transaksi} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <code style={{ background: '#F0E8D8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#A0722A' }}>
                            {t.kode_transaksi}
                          </code>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#8B7355', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <p style={{ margin: '0 0 1px', color: '#3D1F0D', fontSize: '12px', fontWeight: '500' }}>{t.produk.nama_produk}</p>
                          <code style={{ fontSize: '10px', color: '#A0722A' }}>{t.produk.sku}</code>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#3D1F0D', fontWeight: 'bold', textAlign: 'center' }}>{t.jumlah}</td>
                        <td style={{ padding: '12px 14px', color: '#8B7355', fontSize: '12px' }}>{fmt(t.harga_satuan)}</td>
                        <td style={{ padding: '12px 14px', color: '#16A34A', fontWeight: 'bold', fontSize: '13px' }}>{fmt(t.total_harga)}</td>
                        <td style={{ padding: '12px 14px', color: '#8B7355', fontSize: '12px' }}>{t.keterangan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  {data.transaksi.length > 0 && (
                    <tfoot>
                      <tr style={{ background: '#F9F3E8', borderTop: '2px solid #E8DCC8' }}>
                        <td colSpan={3} style={{ padding: '12px 14px', color: '#3D1F0D', fontWeight: 'bold', fontSize: '13px' }}>TOTAL</td>
                        <td style={{ padding: '12px 14px', color: '#3D1F0D', fontWeight: 'bold', textAlign: 'center' }}>{data.summary.totalUnit}</td>
                        <td />
                        <td style={{ padding: '12px 14px', color: '#16A34A', fontWeight: 'bold', fontSize: '14px' }}>{fmt(data.summary.totalPendapatan)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Rekap Stok ── */}
          {tab === 'stok' && (
            <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0E8D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#3D1F0D', fontWeight: 'bold', fontSize: '14px' }}>
                  Nilai Total Inventori: <span style={{ color: '#A0722A' }}>{fmt(data.summary.totalNilaiStok)}</span>
                </span>
                <button onClick={handleExportStok} style={{
                  padding: '8px 16px',
                  background: '#F0FDF4', border: '1px solid #86EFAC',
                  borderRadius: '8px', color: '#16A34A',
                  fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                }}>
                  ⬇️ Export CSV
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#3D1F0D' }}>
                    {['SKU', 'Produk', 'Jenis', 'Harga', 'Masuk', 'Keluar', 'Tersedia', 'Nilai Stok', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', color: '#C4956A', fontSize: '11px', letterSpacing: '1px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rekapStok.map((s, i) => {
                    const st = statusColor[s.status]
                    return (
                      <tr key={s.sku} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <code style={{ background: '#F0E8D8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#A0722A', fontWeight: 'bold' }}>{s.sku}</code>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#3D1F0D', fontSize: '12px', fontWeight: '500' }}>{s.nama_produk}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: '#EDD9B5', color: '#5C3317', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{s.jenis_kulit}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#8B7355', fontSize: '12px' }}>{fmt(s.harga)}</td>
                        <td style={{ padding: '12px 14px', color: '#16A34A', fontWeight: 'bold' }}>+{s.total_masuk}</td>
                        <td style={{ padding: '12px 14px', color: '#DC2626', fontWeight: 'bold' }}>-{s.total_keluar}</td>
                        <td style={{ padding: '12px 14px', color: '#3D1F0D', fontWeight: 'bold', fontSize: '15px' }}>{s.stok_tersedia} <span style={{ fontSize: '11px', color: '#8B7355', fontWeight: 'normal' }}>pcs</span></td>
                        <td style={{ padding: '12px 14px', color: '#A0722A', fontWeight: 'bold', fontSize: '12px' }}>{fmt(s.nilai_stok)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Tab: Log Scan QR ── */}
          {tab === 'scan' && (
            <div style={{ background: '#FFFDF8', borderRadius: '12px', boxShadow: '0 2px 8px rgba(61,31,13,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0E8D8' }}>
                <span style={{ color: '#3D1F0D', fontWeight: 'bold', fontSize: '14px' }}>
                  {data.summary.totalScan} scan tercatat · Menampilkan 20 terbaru
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#3D1F0D' }}>
                    {['Waktu Scan', 'Produk', 'SKU', 'IP Address'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', color: '#C4956A', fontSize: '11px', letterSpacing: '1px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.scanLog.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#8B7355' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>📱</div>
                      Belum ada scan QR dalam periode ini
                    </td></tr>
                  ) : data.scanLog.map((s, i) => (
                    <tr key={s.id_scan} style={{ borderBottom: '1px solid #F0E8D8', background: i % 2 === 0 ? '#FFFDF8' : '#FDF8F0' }}>
                      <td style={{ padding: '12px 14px', color: '#8B7355', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(s.tanggal_scan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#3D1F0D', fontSize: '12px' }}>{s.produk.nama_produk}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <code style={{ background: '#F0E8D8', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#A0722A' }}>{s.produk.sku}</code>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <code style={{ color: '#8B7355', fontSize: '12px' }}>{s.ip_address}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}