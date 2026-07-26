import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hardDeleteProdukById } from '@/lib/hardDeleteProduk'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

// GET - Ambil semua produk
export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/produk')
  if (proxied) return proxied

  const produk = await prisma.produk.findMany({
    where: { is_active: true },
    include: {
      persediaan: true,
      user_story: true,
    },
    orderBy: { created_at: 'desc' }
  })

  const result = produk.map(p => {
    const masuk = p.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
    const keluar = p.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
    return {
      ...p,
      stok_tersedia: masuk - keluar,
      has_story: !!p.user_story,
    }
  })

  return NextResponse.json(result)
}

// POST - Tambah produk baru
export async function POST(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/produk')
  if (proxied) return proxied
  const body = await request.json()
  const sku = String(body.sku ?? '').trim()
  const { nama_produk, jenis_kulit, asal_material, teknik_penyamakan, warna, harga } = body

  if (!sku) {
    return NextResponse.json({ error: 'SKU wajib diisi' }, { status: 400 })
  }

  // SKU unik di DB; produk yang "dihapus" di admin hanya is_active=false sehingga tidak tampil di GET,
  // tapi masih memegang SKU. Untuk tambah baru dengan SKU yang sama, hapus permanen baris nonaktif itu.
  const existing = await prisma.produk.findUnique({ where: { sku } })
  if (existing?.is_active) {
    return NextResponse.json({ error: 'SKU sudah digunakan' }, { status: 400 })
  }
  if (existing && !existing.is_active) {
    await hardDeleteProdukById(prisma, existing.id_produk)
  }

  const produk = await prisma.produk.create({
    data: {
      sku,
      nama_produk,
      jenis_kulit,
      asal_material,
      teknik_penyamakan,
      warna,
      harga: parseFloat(harga),
      id_pengguna: 1,
    }
  })

  // Auto-create user_story & persediaan kosong
  await prisma.userStory.create({
    data: {
      id_produk: produk.id_produk,
      id_pengrajin: 1,
      deskripsi_produk: '',
      narasi_budaya: '',
      tips_perawatan: '',
      is_published: false,
    }
  })

  await prisma.persediaan.create({
    data: {
      id_produk: produk.id_produk,
      stok_masuk: 0,
      stok_keluar: 0,
      keterangan: 'Inisialisasi produk baru',
    }
  })

  return NextResponse.json(produk, { status: 201 })
}