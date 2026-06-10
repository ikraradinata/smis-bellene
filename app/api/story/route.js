import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Ambil story berdasarkan SKU
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'SKU diperlukan' }, { status: 400 })
  }

  const story = await prisma.userStory.findFirst({
    where: { produk: { sku } },
    include: {
      produk: true,
      pengrajin: true,
    }
  })

  return NextResponse.json(story)
}

// PUT - Update story
export async function PUT(request) {
  const body = await request.json()
  const { id_story, id_pengrajin, deskripsi_produk, narasi_budaya, tips_perawatan, is_published } = body

  const story = await prisma.userStory.update({
    where: { id_story: parseInt(id_story) },
    data: {
      id_pengrajin: parseInt(id_pengrajin),
      deskripsi_produk,
      narasi_budaya,
      tips_perawatan,
      is_published: Boolean(is_published),
    }
  })

  return NextResponse.json(story)
}