import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Update produk
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const id_produk = Number.parseInt(id, 10)
    if (Number.isNaN(id_produk)) {
      return NextResponse.json({ error: 'ID produk tidak valid' }, { status: 400 })
    }

    const body = await request.json()
    const { nama_produk, jenis_kulit, asal_material, teknik_penyamakan, warna, harga } = body

    const produk = await prisma.produk.update({
      where: { id_produk },
      data: {
        nama_produk,
        jenis_kulit,
        asal_material,
        teknik_penyamakan,
        warna,
        harga: Number.parseFloat(harga),
      }
    })

    return NextResponse.json(produk)
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gagal update produk' }, { status: 500 })
  }
}

// DELETE - Soft delete produk
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const id_produk = Number.parseInt(id, 10)
    if (Number.isNaN(id_produk)) {
      return NextResponse.json({ error: 'ID produk tidak valid' }, { status: 400 })
    }

    await prisma.produk.update({
      where: { id_produk },
      data: { is_active: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus produk' }, { status: 500 })
  }
}