-- CreateTable
CREATE TABLE `tb_pengguna` (
    `id_pengguna` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tb_pengguna_email_key`(`email`),
    PRIMARY KEY (`id_pengguna`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(20) NOT NULL,
    `nama_produk` VARCHAR(200) NOT NULL,
    `jenis_kulit` ENUM('Domba', 'Sapi', 'Kerbau') NOT NULL,
    `asal_material` VARCHAR(200) NOT NULL,
    `teknik_penyamakan` ENUM('Vegetable', 'Chrome') NOT NULL,
    `warna` VARCHAR(100) NOT NULL,
    `harga` DECIMAL(12, 2) NOT NULL,
    `qr_code_url` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `id_pengguna` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_produk_sku_key`(`sku`),
    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_pengrajin` (
    `id_pengrajin` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pengrajin` VARCHAR(100) NOT NULL,
    `nama_bengkel` VARCHAR(200) NOT NULL,
    `tahun_pengalaman` INTEGER NOT NULL,
    `spesialisasi` VARCHAR(200) NOT NULL,
    `filosofi_desain` TEXT NOT NULL,
    `foto_url` VARCHAR(500) NULL,
    `lokasi` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`id_pengrajin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_user_story` (
    `id_story` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `id_pengrajin` INTEGER NOT NULL,
    `deskripsi_produk` TEXT NOT NULL,
    `narasi_budaya` TEXT NOT NULL,
    `tips_perawatan` TEXT NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_user_story_id_produk_key`(`id_produk`),
    PRIMARY KEY (`id_story`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_persediaan` (
    `id_persediaan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `stok_masuk` INTEGER NOT NULL DEFAULT 0,
    `stok_keluar` INTEGER NOT NULL DEFAULT 0,
    `tanggal_update` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan` VARCHAR(255) NULL,

    PRIMARY KEY (`id_persediaan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_transaksi` (
    `id_transaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_transaksi` VARCHAR(50) NOT NULL,
    `id_produk` INTEGER NOT NULL,
    `id_pengguna` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga_satuan` DECIMAL(12, 2) NOT NULL,
    `total_harga` DECIMAL(12, 2) NOT NULL,
    `tanggal_transaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan` TEXT NULL,

    UNIQUE INDEX `tb_transaksi_kode_transaksi_key`(`kode_transaksi`),
    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_scan_log` (
    `id_scan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produk` INTEGER NOT NULL,
    `ip_address` VARCHAR(50) NOT NULL,
    `user_agent` TEXT NOT NULL,
    `tanggal_scan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_scan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_produk` ADD CONSTRAINT `tb_produk_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `tb_pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_user_story` ADD CONSTRAINT `tb_user_story_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `tb_produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_user_story` ADD CONSTRAINT `tb_user_story_id_pengrajin_fkey` FOREIGN KEY (`id_pengrajin`) REFERENCES `tb_pengrajin`(`id_pengrajin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_persediaan` ADD CONSTRAINT `tb_persediaan_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `tb_produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `tb_produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `tb_pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_scan_log` ADD CONSTRAINT `tb_scan_log_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `tb_produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;
