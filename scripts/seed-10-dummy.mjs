import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Memulai Pembuatan 10 Data Dummy per Menu (Local Testing E2E)...')

  // 1. Pengguna / Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const superadmin = await prisma.pengguna.upsert({
    where: { email: 'admin@bellene.id' },
    update: {},
    create: {
      nama: 'Admin Utama Bellene',
      email: 'admin@bellene.id',
      password: hashedPassword,
      role: 'superadmin',
    },
  })

  // 2. Pengrajin (10 records)
  const pengrajinData = [
    { nama_pengrajin: 'Pak Asep Kurniawan', nama_bengkel: 'Bengkel Kulit Asep Putra', tahun_pengalaman: 25, spesialisasi: 'Jaket & Tas Kulit Domba', filosofi_desain: 'Setiap jahitan adalah doa dan kebanggaan Garut.', lokasi: 'Sukaregang, Garut' },
    { nama_pengrajin: 'Ibu Hajah Ratna', nama_bengkel: 'Kerajinan Kulit Ratna Jaya', tahun_pengalaman: 18, spesialisasi: 'Dompet & Aksesoris Wanita', filosofi_desain: 'Kelembutan kulit bertemu keanggunan desain modern.', lokasi: 'Cikajang, Garut' },
    { nama_pengrajin: 'Pak Ujang Suherman', nama_bengkel: 'Ujang Leather Craft', tahun_pengalaman: 30, spesialisasi: 'Sabuk & Holster Kulit Sapi', filosofi_desain: 'Ketahanan dan kekuatan adalah prioritas utama.', lokasi: 'Tarogong Kaler, Garut' },
    { nama_pengrajin: 'Mas Dedi Priyanto', nama_bengkel: 'Dedi Studio Leather', tahun_pengalaman: 12, spesialisasi: 'Sepatu Boots Kulit Vintage', filosofi_desain: 'Sentuhan klasik yang tak lekang oleh waktu.', lokasi: 'Karangpawitan, Garut' },
    { nama_pengrajin: 'Pak Bambang Sugiarto', nama_bengkel: 'Bambang Leather Art', tahun_pengalaman: 22, spesialisasi: 'Tas Backpack & Travel Bag', filosofi_desain: 'Fungsionalitas tinggi dengan material kulit grade A.', lokasi: 'Sukaregang, Garut' },
    { nama_pengrajin: 'Ibu Siti Aminah', nama_bengkel: 'Aminah Collection', tahun_pengalaman: 15, spesialisasi: 'Gantungan Kunci & Card Holder', filosofi_desain: 'Detail kecil yang menghadirkan kepuasan besar.', lokasi: 'Samarang, Garut' },
    { nama_pengrajin: 'Pak Cecep Ramdani', nama_bengkel: 'Cecep Leather Works', tahun_pengalaman: 20, spesialisasi: 'Rompi & Jaket Motor Kulit', filosofi_desain: 'Keamanan berkendara berbalut seni kulit tradisional.', lokasi: 'Leles, Garut' },
    { nama_pengrajin: 'Pak Hendra Gunawan', nama_bengkel: 'Hendra Atelier', tahun_pengalaman: 14, spesialisasi: 'Tali Jam & Strap Kamera', filosofi_desain: 'Presisi tinggi untuk produk-produk mikro.', lokasi: 'Kadungora, Garut' },
    { nama_pengrajin: 'Ibu Nenden Sri', nama_bengkel: 'Nenden Craft House', tahun_pengalaman: 16, spesialisasi: 'Pouch & Totebag Kulit', filosofi_desain: 'Kombinasi serat alam dan kelembutan kulit kerbau.', lokasi: 'Cilawu, Garut' },
    { nama_pengrajin: 'Pak Yudi Suwandi', nama_bengkel: 'Yudi Garut Leather', tahun_pengalaman: 28, spesialisasi: 'Topi & Sarung Tangan Kulit', filosofi_desain: 'Kenyamanan maksimal untuk pemakaian sehari-hari.', lokasi: 'Sukaregang, Garut' },
  ]

  console.log('📦 Seeding 10 Pengrajin...')
  const createdPengrajin = []
  for (let i = 0; i < pengrajinData.length; i++) {
    const p = await prisma.pengrajin.upsert({
      where: { id_pengrajin: i + 1 },
      update: pengrajinData[i],
      create: pengrajinData[i],
    })
    createdPengrajin.push(p)
  }

  // 3. Produk (10 records)
  const produkData = [
    { sku: 'JKT-001', nama_produk: 'Jaket Kulit Domba Garut Classic', jenis_kulit: 'Domba', asal_material: 'Domba Priangan, Garut', teknik_penyamakan: 'Vegetable', warna: 'Cokelat Tua', harga: 1250000 },
    { sku: 'TAS-002', nama_produk: 'Tas Selempang Kulit Sapi Premium', jenis_kulit: 'Sapi', asal_material: 'Sapi Lokal Jawa', teknik_penyamakan: 'Chrome', warna: 'Hitam', harga: 850000 },
    { sku: 'DMP-003', nama_produk: 'Dompet Lipat Pria Kulit Domba', jenis_kulit: 'Domba', asal_material: 'Sukaregang, Garut', teknik_penyamakan: 'Vegetable', warna: 'Tan / Tan Natural', harga: 275000 },
    { sku: 'SPT-004', nama_produk: 'Sepatu Boots Kulit Sapi Workwear', jenis_kulit: 'Sapi', asal_material: 'Sapi Limosin Garut', teknik_penyamakan: 'Chrome', warna: 'Dark Brown', harga: 1450000 },
    { sku: 'SBK-005', nama_produk: 'Sabuk Kulit Kerbau Pull-Up', jenis_kulit: 'Kerbau', asal_material: 'Kerbau Banten', teknik_penyamakan: 'Vegetable', warna: 'Mahogani', harga: 320000 },
    { sku: 'TOT-006', nama_produk: 'Totebag Wanita Kulit Domba Soft', jenis_kulit: 'Domba', asal_material: 'Sukaregang, Garut', teknik_penyamakan: 'Vegetable', warna: 'Maroon', harga: 950000 },
    { sku: 'RMP-007', nama_produk: 'Rompi Motor Kulit Sapi Tough', jenis_kulit: 'Sapi', asal_material: 'Sapi Jawa Barat', teknik_penyamakan: 'Chrome', warna: 'Hitam Matte', harga: 780000 },
    { sku: 'CRD-008', nama_produk: 'Card Holder Slim Leather', jenis_kulit: 'Domba', asal_material: 'Sukaregang, Garut', teknik_penyamakan: 'Vegetable', warna: 'Navy Blue', harga: 150000 },
    { sku: 'TPI-009', nama_produk: 'Topi Komando Kulit Kerbau', jenis_kulit: 'Kerbau', asal_material: 'Cilawu, Garut', teknik_penyamakan: 'Chrome', warna: 'Cokelat Espresso', harga: 225000 },
    { sku: 'STR-010', nama_produk: 'Strap Kamera Vintage Leather', jenis_kulit: 'Sapi', asal_material: 'Sapi Lokal', teknik_penyamakan: 'Vegetable', warna: 'Cognac', harga: 195000 },
  ]

  console.log('🛍️ Seeding 10 Produk...')
  const createdProduk = []
  for (let i = 0; i < produkData.length; i++) {
    const item = produkData[i]
    const prod = await prisma.produk.upsert({
      where: { sku: item.sku },
      update: { ...item, id_pengguna: superadmin.id_pengguna, is_active: true },
      create: { ...item, id_pengguna: superadmin.id_pengguna, is_active: true },
    })
    createdProduk.push(prod)
  }

  // 4. User Story (10 records, 1 per produk)
  console.log('📖 Seeding 10 User Story...')
  for (let i = 0; i < createdProduk.length; i++) {
    const prod = createdProduk[i]
    const pengrajin = createdPengrajin[i % createdPengrajin.length]
    await prisma.userStory.upsert({
      where: { id_produk: prod.id_produk },
      update: {
        id_pengrajin: pengrajin.id_pengrajin,
        deskripsi_produk: `Koleksi bermutu tinggi ${prod.nama_produk} dengan pengerjaan handmade oleh ${pengrajin.nama_pengrajin}.`,
        narasi_budaya: `Kerajinan kulit di kawasan ${pengrajin.lokasi} telah diwariskan lintas generasi, menggabungkan kearifan lokal Sunda dengan standar kualitas dunia.`,
        tips_perawatan: `1. Hindari paparan air berlebih.\n2. Bersihkan secara teratur dengan lap mikrofiber.\n3. Oleskan pelembab kulit khusus secara berkala.`,
        is_published: true,
      },
      create: {
        id_produk: prod.id_produk,
        id_pengrajin: pengrajin.id_pengrajin,
        deskripsi_produk: `Koleksi bermutu tinggi ${prod.nama_produk} dengan pengerjaan handmade oleh ${pengrajin.nama_pengrajin}.`,
        narasi_budaya: `Kerajinan kulit di kawasan ${pengrajin.lokasi} telah diwariskan lintas generasi, menggabungkan kearifan lokal Sunda dengan standar kualitas dunia.`,
        tips_perawatan: `1. Hindari paparan air berlebih.\n2. Bersihkan secara teratur dengan lap mikrofiber.\n3. Oleskan pelembab kulit khusus secara berkala.`,
        is_published: true,
      },
    })
  }

  // 5. Persediaan (10 records)
  console.log('📊 Seeding 10 Persediaan...')
  for (let i = 0; i < createdProduk.length; i++) {
    const prod = createdProduk[i]
    const stokMasuk = 20 + (i * 5)
    const stokKeluar = i * 2
    await prisma.persediaan.create({
      data: {
        id_produk: prod.id_produk,
        stok_masuk: stokMasuk,
        stok_keluar: stokKeluar,
        keterangan: `Pengadaan stok batch ${i + 1}`,
      },
    })
  }

  // 6. Transaksi (10 records)
  console.log('💳 Seeding 10 Transaksi...')
  for (let i = 0; i < createdProduk.length; i++) {
    const prod = createdProduk[i]
    const jumlah = (i % 3) + 1
    const hargaSatuan = prod.harga
    const totalHarga = Number(hargaSatuan) * jumlah
    await prisma.transaksi.upsert({
      where: { kode_transaksi: `TRX-20260726-00${i + 1}` },
      update: {},
      create: {
        kode_transaksi: `TRX-20260726-00${i + 1}`,
        id_produk: prod.id_produk,
        id_pengguna: superadmin.id_pengguna,
        jumlah: jumlah,
        harga_satuan: hargaSatuan,
        total_harga: totalHarga,
        keterangan: `Penjualan dummy testing #${i + 1}`,
      },
    })
  }

  // 7. Scan Log (10 records)
  console.log('🔍 Seeding 10 Scan Log...')
  for (let i = 0; i < createdProduk.length; i++) {
    const prod = createdProduk[i]
    await prisma.scanLog.create({
      data: {
        id_produk: prod.id_produk,
        ip_address: `127.0.0.${i + 1}`,
        user_agent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120.0.0.${i}`,
      },
    })
  }

  console.log('\n✨ SEEDING DUMMY DATA COMPLETED SUCCESSFULLY!')
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
