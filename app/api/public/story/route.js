import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, `/api/public/story${new URL(request.url).search}`)
  if (proxied) return proxied
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'SKU diperlukan' }, { status: 400 })
  }

  const produk = await prisma.produk.findUnique({
    where: { sku, is_active: true },
    include: {
      user_story: {
        include: { pengrajin: true }
      },
      persediaan: true,
    }
  })

  if (!produk || !produk.user_story?.is_published) {
    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
  }

  // Hitung stok tersedia
  const totalMasuk  = produk.persediaan.reduce((s, x) => s + x.stok_masuk, 0)
  const totalKeluar = produk.persediaan.reduce((s, x) => s + x.stok_keluar, 0)
  const stokTersedia = totalMasuk - totalKeluar

  // Catat scan log
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : '0.0.0.0'
  const userAgent = request.headers.get('user-agent') || ''

  await prisma.scanLog.create({
    data: {
      id_produk: produk.id_produk,
      ip_address: ip,
      user_agent: userAgent,
    }
  })

  return NextResponse.json({
    produk: {
      id_produk:         produk.id_produk,
      sku:               produk.sku,
      nama_produk:       produk.nama_produk,
      jenis_kulit:       produk.jenis_kulit,
      asal_material:     produk.asal_material,
      teknik_penyamakan: produk.teknik_penyamakan,
      warna:             produk.warna,
      harga:             produk.harga,
    },
    story: {
      deskripsi_produk: produk.user_story.deskripsi_produk,
      narasi_budaya:    produk.user_story.narasi_budaya,
      tips_perawatan:   produk.user_story.tips_perawatan,
    },
    pengrajin: produk.user_story.pengrajin,
    stok_tersedia: stokTersedia,
  })
}