import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

// GET - Ambil semua transaksi
export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, `/api/transaksi${new URL(request.url).search}`)
  if (proxied) return proxied

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where = {}
  if (from && to) {
    where.tanggal_transaksi = {
      gte: new Date(from),
      lte: new Date(to + 'T23:59:59'),
    }
  }

  const transaksi = await prisma.transaksi.findMany({
    where,
    include: {
      produk: { select: { sku: true, nama_produk: true, jenis_kulit: true } },
      pengguna: { select: { nama: true } },
    },
    orderBy: { tanggal_transaksi: 'desc' },
  })

  return NextResponse.json(transaksi)
}

// POST - Catat transaksi baru
export async function POST(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/transaksi')
  if (proxied) return proxied

  const body = await request.json()
  const { id_produk, jumlah, harga_satuan, keterangan } = body

  if (!id_produk || !jumlah || !harga_satuan) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  // Cek stok tersedia
  const produk = await prisma.produk.findUnique({
    where: { id_produk: parseInt(id_produk) },
    include: { persediaan: true },
  })

  if (!produk) {
    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
  }

  const totalMasuk  = produk.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
  const totalKeluar = produk.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
  const stokTersedia = totalMasuk - totalKeluar

  if (parseInt(jumlah) > stokTersedia) {
    return NextResponse.json({
      error: `Stok tidak mencukupi. Tersedia: ${stokTersedia} pcs`
    }, { status: 400 })
  }

  // Generate kode transaksi unik
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const count = await prisma.transaksi.count()
  const kodeTrx = `TRX-${dateStr}-${String(count + 1).padStart(3, '0')}`

  const total_harga = parseInt(jumlah) * parseFloat(harga_satuan)

  // Simpan transaksi + kurangi stok dalam satu operasi
  const [transaksi] = await prisma.$transaction([
    prisma.transaksi.create({
      data: {
        kode_transaksi: kodeTrx,
        id_produk: parseInt(id_produk),
        id_pengguna: 1,
        jumlah: parseInt(jumlah),
        harga_satuan: parseFloat(harga_satuan),
        total_harga,
        keterangan: keterangan || '',
      },
    }),
    prisma.persediaan.create({
      data: {
        id_produk: parseInt(id_produk),
        stok_masuk: 0,
        stok_keluar: parseInt(jumlah),
        keterangan: `Penjualan: ${kodeTrx}`,
      },
    }),
  ])

  return NextResponse.json(transaksi, { status: 201 })
}