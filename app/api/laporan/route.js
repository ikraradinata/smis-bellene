import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, `/api/laporan${new URL(request.url).search}`)
  if (proxied) return proxied
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  const dateFilter = from && to ? {
    gte: new Date(from),
    lte: new Date(to + 'T23:59:59'),
  } : undefined

  // Transaksi dalam periode
  const transaksi = await prisma.transaksi.findMany({
    where: dateFilter ? { tanggal_transaksi: dateFilter } : {},
    include: {
      produk: { select: { sku: true, nama_produk: true, jenis_kulit: true } },
      pengguna: { select: { nama: true } },
    },
    orderBy: { tanggal_transaksi: 'desc' },
  })

  // Rekap stok semua produk
  const produk = await prisma.produk.findMany({
    where: { is_active: true },
    include: { persediaan: true },
    orderBy: { sku: 'asc' },
  })

  const rekapStok = produk.map(p => {
    const masuk   = p.persediaan.reduce((s, x) => s + x.stok_masuk,  0)
    const keluar  = p.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
    const tersedia = masuk - keluar
    return {
      sku: p.sku,
      nama_produk: p.nama_produk,
      jenis_kulit: p.jenis_kulit,
      harga: Number(p.harga),
      total_masuk: masuk,
      total_keluar: keluar,
      stok_tersedia: tersedia,
      status: tersedia === 0 ? 'Habis' : tersedia < 5 ? 'Kritis' : 'Aman',
      nilai_stok: tersedia * Number(p.harga),
    }
  })

  // Scan log dalam periode
  const scanLog = await prisma.scanLog.findMany({
    where: dateFilter ? { tanggal_scan: dateFilter } : {},
    include: { produk: { select: { sku: true, nama_produk: true } } },
    orderBy: { tanggal_scan: 'desc' },
  })

  // Summary KPI
  const totalPendapatan   = transaksi.reduce((s, t) => s + Number(t.total_harga), 0)
  const totalUnit         = transaksi.reduce((s, t) => s + t.jumlah, 0)
  const totalNilaiStok    = rekapStok.reduce((s, p) => s + p.nilai_stok, 0)
  const totalScan         = scanLog.length

  // Top produk terlaris
  const produkMap = {}
  transaksi.forEach(t => {
    const key = t.produk.sku
    if (!produkMap[key]) produkMap[key] = { ...t.produk, total_unit: 0, total_pendapatan: 0 }
    produkMap[key].total_unit        += t.jumlah
    produkMap[key].total_pendapatan  += Number(t.total_harga)
  })
  const topProduk = Object.values(produkMap)
    .sort((a, b) => b.total_unit - a.total_unit)
    .slice(0, 5)

  // Tren transaksi per hari
  const trenMap = {}
  transaksi.forEach(t => {
    const day = new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    if (!trenMap[day]) trenMap[day] = { label: day, pendapatan: 0, unit: 0 }
    trenMap[day].pendapatan += Number(t.total_harga)
    trenMap[day].unit       += t.jumlah
  })
  const tren = Object.values(trenMap).slice(-14)

  return NextResponse.json({
    summary: { totalPendapatan, totalUnit, totalNilaiStok, totalScan, totalTransaksi: transaksi.length },
    transaksi,
    rekapStok,
    topProduk,
    tren,
    scanLog: scanLog.slice(0, 20),
  })
}