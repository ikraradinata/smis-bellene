import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import { proxyToRemoteIfConfigured } from '@/lib/apiProxy'

export async function POST(request) {
  const proxied = await proxyToRemoteIfConfigured(request, '/api/qr')
  if (proxied) return proxied
  const { sku } = await request.json()

  if (!sku) {
    return NextResponse.json({ error: 'SKU diperlukan' }, { status: 400 })
  }

  // Generate URL untuk consumer page
  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
  const storyUrl = `${baseUrl}/story?sku=${sku}`

  // Generate QR Code sebagai base64 image
  const qrBase64 = await QRCode.toDataURL(storyUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 2,
    color: {
      dark: '#3D1F0D',
      light: '#F9F3E8',
    },
    width: 400,
  })

  // Simpan URL ke database
  await prisma.produk.update({
    where: { sku },
    data: { qr_code_url: storyUrl }
  })

  return NextResponse.json({ qrBase64, storyUrl })
}