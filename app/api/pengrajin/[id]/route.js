import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Update pengrajin
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const id_pengrajin = Number.parseInt(id, 10)
    if (Number.isNaN(id_pengrajin)) {
      return NextResponse.json({ error: 'ID pengrajin tidak valid' }, { status: 400 })
    }

    const body = await request.json()
    const {
      nama_pengrajin,
      nama_bengkel,
      tahun_pengalaman,
      spesialisasi,
      filosofi_desain,
      foto_url,
      lokasi,
    } = body

    if (!nama_pengrajin?.trim()) {
      return NextResponse.json({ error: 'Nama pengrajin wajib diisi' }, { status: 400 })
    }
    if (!nama_bengkel?.trim()) {
      return NextResponse.json({ error: 'Nama bengkel wajib diisi' }, { status: 400 })
    }
    if (!lokasi?.trim()) {
      return NextResponse.json({ error: 'Lokasi wajib diisi' }, { status: 400 })
    }

    const tahun = Number.parseInt(tahun_pengalaman, 10)
    if (Number.isNaN(tahun) || tahun < 0) {
      return NextResponse.json({ error: 'Tahun pengalaman tidak valid' }, { status: 400 })
    }

    const pengrajin = await prisma.pengrajin.update({
      where: { id_pengrajin },
      data: {
        nama_pengrajin: nama_pengrajin.trim(),
        nama_bengkel: nama_bengkel.trim(),
        tahun_pengalaman: tahun,
        spesialisasi: spesialisasi?.trim() || '',
        filosofi_desain: filosofi_desain?.trim() || '',
        foto_url: foto_url?.trim() || null,
        lokasi: lokasi.trim(),
      },
    })

    return NextResponse.json(pengrajin)
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gagal update pengrajin' }, { status: 500 })
  }
}

// DELETE - Hapus pengrajin
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const id_pengrajin = Number.parseInt(id, 10)
    if (Number.isNaN(id_pengrajin)) {
      return NextResponse.json({ error: 'ID pengrajin tidak valid' }, { status: 400 })
    }

    const storyCount = await prisma.userStory.count({
      where: { id_pengrajin },
    })

    if (storyCount > 0) {
      return NextResponse.json(
        { error: `Pengrajin masih digunakan di ${storyCount} story produk. Pindahkan story terlebih dahulu.` },
        { status: 400 }
      )
    }

    await prisma.pengrajin.delete({ where: { id_pengrajin } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus pengrajin' }, { status: 500 })
  }
}
