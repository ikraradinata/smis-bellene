import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

export async function GET(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/persediaan/riwayat')
  if (proxied) return proxied
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