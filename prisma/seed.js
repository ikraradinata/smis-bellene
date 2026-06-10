const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai seeding...')

  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.pengguna.upsert({
    where: { email: 'admin@bellene.id' },
    update: {},
    create: {
      nama: 'Admin Bellene',
      email: 'admin@bellene.id',
      password: hashedPassword,
      role: 'superadmin',
    },
  })
  console.log('✅ Admin dibuat:', admin.email)

  const pengrajin = await prisma.pengrajin.upsert({
    where: { id_pengrajin: 1 },
    update: {},
    create: {
      nama_pengrajin: 'Pak Asep Kurniawan',
      nama_bengkel: 'Bengkel Kulit Asep Putra',
      tahun_pengalaman: 25,
      spesialisasi: 'Jaket dan Tas Kulit Domba',
      filosofi_desain: 'Setiap jahitan adalah doa, setiap lembar kulit adalah warisan leluhur Garut yang harus dijaga keasliannya.',
      foto_url: null,
      lokasi: 'Sukaregang, Garut, Jawa Barat',
    },
  })
  console.log('✅ Pengrajin dibuat:', pengrajin.nama_pengrajin)

  const produk = await prisma.produk.upsert({
    where: { sku: 'JKT-001' },
    update: {},
    create: {
      sku: 'JKT-001',
      nama_produk: 'Jaket Kulit Domba Garut Classic',
      jenis_kulit: 'Domba',
      asal_material: 'Domba Priangan, Garut, Jawa Barat',
      teknik_penyamakan: 'Vegetable',
      warna: 'Cokelat Tua',
      harga: 1250000,
      is_active: true,
      id_pengguna: admin.id_pengguna,
    },
  })
  console.log('✅ Produk dibuat:', produk.nama_produk)

  await prisma.userStory.upsert({
    where: { id_produk: produk.id_produk },
    update: {},
    create: {
      id_produk: produk.id_produk,
      id_pengrajin: pengrajin.id_pengrajin,
      deskripsi_produk: 'Jaket kulit domba Garut dengan jahitan tangan pilihan. Dibuat dari bahan kulit domba Priangan pilihan yang terkenal dengan kelembutannya.',
      narasi_budaya: 'Kulit Garut telah menjadi warisan budaya Jawa Barat selama lebih dari 100 tahun. Kawasan Sukaregang dikenal sebagai pusat kerajinan kulit terbaik di Indonesia.',
      tips_perawatan: '1. Simpan di tempat tidak terkena sinar matahari langsung.\n2. Bersihkan dengan kain lembab.\n3. Gunakan kondisioner kulit setiap 3 bulan.\n4. Gantung jaket, jangan dilipat.',
      is_published: true,
    },
  })
  console.log('✅ User Story dibuat')

  await prisma.persediaan.create({
    data: {
      id_produk: produk.id_produk,
      stok_masuk: 15,
      stok_keluar: 0,
      keterangan: 'Stok awal produk',
    },
  })
  console.log('✅ Stok awal dibuat: 15 pcs')

  console.log('\n🎉 Seeding selesai!')
  console.log('📧 Login: admin@bellene.id')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })