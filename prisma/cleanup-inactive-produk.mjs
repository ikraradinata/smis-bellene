/**
 * Hapus permanen semua produk dengan is_active=false (soft-delete admin).
 * Jalankan: npm run db:cleanup-inactive
 */
import { PrismaClient } from '@prisma/client'
import { hardDeleteProdukById } from '../lib/hardDeleteProduk.js'

const prisma = new PrismaClient()

async function main() {
  const inactive = await prisma.produk.findMany({
    where: { is_active: false },
    select: { id_produk: true, sku: true, nama_produk: true },
  })
  console.log(`Menghapus ${inactive.length} produk tidak aktif (soft-deleted)...`)
  for (const p of inactive) {
    await hardDeleteProdukById(prisma, p.id_produk)
    console.log(`  - [${p.sku}] ${p.nama_produk} (id ${p.id_produk})`)
  }
  console.log('Selesai.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
