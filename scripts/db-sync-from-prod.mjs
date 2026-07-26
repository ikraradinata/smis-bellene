import { PrismaClient } from '@prisma/client'
import {
  getDatabaseHost,
  isLocalDatabaseUrl,
  isRemoteDatabaseUrl,
  loadEnvFiles,
} from './env-utils.mjs'

loadEnvFiles('.env', '.env.production')

const localUrl = process.env.DATABASE_URL
const prodUrl = process.env.DATABASE_URL_PRODUCTION

if (!localUrl) {
  console.error('❌ DATABASE_URL tidak ditemukan di .env')
  process.exit(1)
}

if (!prodUrl) {
  console.error('❌ DATABASE_URL_PRODUCTION tidak ditemukan.')
  console.error('   Buat file .env.production dengan isi:')
  console.error('   DATABASE_URL_PRODUCTION="mysql://..."')
  process.exit(1)
}

if (!isLocalDatabaseUrl(localUrl)) {
  console.error('❌ DATABASE_URL harus mengarah ke database lokal (localhost).')
  process.exit(1)
}

if (!isRemoteDatabaseUrl(prodUrl)) {
  console.error('❌ DATABASE_URL_PRODUCTION harus mengarah ke database cloud (Railway).')
  process.exit(1)
}

const force = process.argv.includes('--force')

if (!force) {
  console.log('⚠️  Script ini akan MENIMPA seluruh data database lokal dengan data production.')
  console.log(`   Lokal : ${getDatabaseHost(localUrl)}`)
  console.log(`   Prod  : ${getDatabaseHost(prodUrl)}`)
  console.log('\n   Jalankan ulang dengan flag --force untuk melanjutkan:\n')
  console.log('   npm run db:sync-prod -- --force\n')
  process.exit(0)
}

const prod = new PrismaClient({
  datasources: { db: { url: prodUrl } },
})

const local = new PrismaClient({
  datasources: { db: { url: localUrl } },
})

async function clearLocal() {
  await local.scanLog.deleteMany()
  await local.transaksi.deleteMany()
  await local.persediaan.deleteMany()
  await local.userStory.deleteMany()
  await local.produk.deleteMany()
  await local.pengrajin.deleteMany()
  await local.pengguna.deleteMany()
}

async function copyProductionToLocal() {
  console.log('📥 Mengambil data dari production...')

  const [
    pengguna,
    pengrajin,
    produk,
    userStories,
    persediaan,
    transaksi,
    scanLogs,
  ] = await Promise.all([
    prod.pengguna.findMany({ orderBy: { id_pengguna: 'asc' } }),
    prod.pengrajin.findMany({ orderBy: { id_pengrajin: 'asc' } }),
    prod.produk.findMany({ orderBy: { id_produk: 'asc' } }),
    prod.userStory.findMany({ orderBy: { id_story: 'asc' } }),
    prod.persediaan.findMany({ orderBy: { id_persediaan: 'asc' } }),
    prod.transaksi.findMany({ orderBy: { id_transaksi: 'asc' } }),
    prod.scanLog.findMany({ orderBy: { id_scan: 'asc' } }),
  ])

  console.log('🗑️  Menghapus data lokal...')
  await clearLocal()

  console.log('📤 Menyalin data ke database lokal...')

  for (const row of pengguna) {
    await local.pengguna.create({ data: row })
  }

  for (const row of pengrajin) {
    await local.pengrajin.create({ data: row })
  }

  for (const row of produk) {
    await local.produk.create({ data: row })
  }

  for (const row of userStories) {
    await local.userStory.create({ data: row })
  }

  for (const row of persediaan) {
    await local.persediaan.create({ data: row })
  }

  for (const row of transaksi) {
    await local.transaksi.create({ data: row })
  }

  for (const row of scanLogs) {
    await local.scanLog.create({ data: row })
  }

  console.log('\n✅ Sync selesai!')
  console.log(`   Pengguna   : ${pengguna.length}`)
  console.log(`   Pengrajin  : ${pengrajin.length}`)
  console.log(`   Produk     : ${produk.length}`)
  console.log(`   User Story : ${userStories.length}`)
  console.log(`   Persediaan : ${persediaan.length}`)
  console.log(`   Transaksi  : ${transaksi.length}`)
  console.log(`   Scan Log   : ${scanLogs.length}`)
}

copyProductionToLocal()
  .catch((error) => {
    console.error('❌ Sync gagal:', error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prod.$disconnect()
    await local.$disconnect()
  })
