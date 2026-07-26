import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/dashboard')
  if (proxied) return proxied

  // Total produk aktif
  const totalProduk = await prisma.produk.count({
    where: { is_active: true }
  })

  // Total stok tersedia (sum masuk - sum keluar)
  const stokData = await prisma.persediaan.aggregate({
    _sum: { stok_masuk: true, stok_keluar: true }
  })
  const totalStok = (stokData._sum.stok_masuk || 0) - (stokData._sum.stok_keluar || 0)

  // Transaksi hari ini
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const transaksiHariIni = await prisma.transaksi.count({
    where: { tanggal_transaksi: { gte: today } }
  })

  // Total scan bulan ini
  const bulanIni = new Date()
  bulanIni.setDate(1)
  bulanIni.setHours(0, 0, 0, 0)
  const totalScan = await prisma.scanLog.count({
    where: { tanggal_scan: { gte: bulanIni } }
  })

  // Transaksi 7 hari terakhir
  const tujuhHariLalu = new Date()
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6)
  tujuhHariLalu.setHours(0, 0, 0, 0)

  const transaksi7Hari = await prisma.transaksi.findMany({
    where: { tanggal_transaksi: { gte: tujuhHariLalu } },
    select: { tanggal_transaksi: true, total_harga: true }
  })

  // Format data grafik 7 hari
  const grafik7Hari = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const label = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
    const total = transaksi7Hari
      .filter(t => {
        const d = new Date(t.tanggal_transaksi)
        return d.toDateString() === date.toDateString()
      })
      .reduce((sum, t) => sum + Number(t.total_harga), 0)
    grafik7Hari.push({ label, total })
  }

  // Produk dengan stok kritis (< 5)
  const semuaProduk = await prisma.produk.findMany({
    where: { is_active: true },
    include: { persediaan: true }
  })

  const produkKritis = semuaProduk
    .map(p => {
      const masuk = p.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
      const keluar = p.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
      return { ...p, stok: masuk - keluar }
    })
    .filter(p => p.stok < 5)

  return NextResponse.json({
    totalProduk,
    totalStok,
    transaksiHariIni,
    totalScan,
    grafik7Hari,
    produkKritis,
  })
}