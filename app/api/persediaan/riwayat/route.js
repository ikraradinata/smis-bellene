import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const riwayat = await prisma.persediaan.findMany({
    include: {
      produk: {
        select: { sku: true, nama_produk: true }
      }
    },
    orderBy: { tanggal_update: 'desc' },
    take: 50,
  })

  return NextResponse.json(riwayat)
}