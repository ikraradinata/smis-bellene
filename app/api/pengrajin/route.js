import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

// GET - Ambil semua pengrajin
export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/pengrajin')
  if (proxied) return proxied

  const pengrajin = await prisma.pengrajin.findMany({
    include: {
      _count: { select: { user_story: true } },
    },
    orderBy: { nama_pengrajin: 'asc' },
  })

  const result = pengrajin.map(p => ({
    ...p,
    jumlah_story: p._count.user_story,
    _count: undefined,
  }))

  return NextResponse.json(result)
}

// POST - Tambah pengrajin baru
export async function POST(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/pengrajin')
  if (proxied) return proxied
  try {
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

    const pengrajin = await prisma.pengrajin.create({
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

    return NextResponse.json(pengrajin, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gagal menambah pengrajin' }, { status: 500 })
  }
}
