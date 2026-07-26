import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getDatabaseHost,
  isLocalDatabaseUrl,
  loadEnvFiles,
} from './env-utils.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

loadEnvFiles('.env')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL tidak ditemukan. Buat file .env terlebih dahulu.')
  process.exit(1)
}

if (!isLocalDatabaseUrl(databaseUrl)) {
  console.error('❌ Dibatalkan: DATABASE_URL bukan database lokal.')
  console.error(`   Host saat ini: ${getDatabaseHost(databaseUrl)}`)
  console.error('   Script ini hanya untuk localhost / 127.0.0.1')
  process.exit(1)
}

console.log('🔄 Reset database lokal...')
console.log(`   Host: ${getDatabaseHost(databaseUrl)}`)
console.log('   Langkah: drop schema → migrate → seed\n')

const result = spawnSync('npx', ['prisma', 'migrate', 'reset', '--force'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log('\n✅ Database lokal sudah di-reset dan di-seed ulang.')
console.log('📧 Login: admin@bellene.id')
console.log('🔑 Password: admin123')
