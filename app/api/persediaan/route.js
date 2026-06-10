import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Rekap stok semua produk
export async function GET() {
  const produk = await prisma.produk.findMany({
    where: { is_active: true },
    include: { persediaan: true },
    orderBy: { sku: 'asc' }
  })

  const result = produk.map(p => {
    const totalMasuk = p.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
    const totalKeluar = p.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
    const stokTersedia = totalMasuk - totalKeluar

    let status = 'Aman'
    if (stokTersedia === 0) status = 'Habis'
    else if (stokTersedia < 5) status = 'Kritis'

    return {
      id_produk: p.id_produk,
      sku: p.sku,
      nama_produk: p.nama_produk,
      jenis_kulit: p.jenis_kulit,
      total_masuk: totalMasuk,
      total_keluar: totalKeluar,
      stok_tersedia: stokTersedia,
      status,
    }
  })

  return NextResponse.json(result)
}

// POST - Input mutasi stok
export async function POST(request) {
  const body = await request.json()
  const { id_produk, jenis_mutasi, jumlah, keterangan } = body

  if (!id_produk || !jenis_mutasi || !jumlah || jumlah <= 0) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  // Cek stok jika keluar
  if (jenis_mutasi === 'keluar') {
    const produk = await prisma.produk.findUnique({
      where: { id_produk: parseInt(id_produk) },
      include: { persediaan: true }
    })
    const totalMasuk = produk.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
    const totalKeluar = produk.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
    const stokTersedia = totalMasuk - totalKeluar

    if (jumlah > stokTersedia) {
      return NextResponse.json({
        error: `Stok tidak mencukupi. Stok tersedia: ${stokTersedia} pcs`
      }, { status: 400 })
    }
  }

  const mutasi = await prisma.persediaan.create({
    data: {
      id_produk: parseInt(id_produk),
      stok_masuk: jenis_mutasi === 'masuk' ? parseInt(jumlah) : 0,
      stok_keluar: jenis_mutasi === 'keluar' ? parseInt(jumlah) : 0,
      keterangan: keterangan || '',
    }
  })

  return NextResponse.json(mutasi, { status: 201 })
}