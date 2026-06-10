/**
 * Hapus satu produk beserta relasinya (urutan menyesuaikan FK RESTRICT di MySQL).
 */
export async function hardDeleteProdukById(prisma, id_produk) {
  await prisma.$transaction(async (tx) => {
    await tx.scanLog.deleteMany({ where: { id_produk } })
    await tx.transaksi.deleteMany({ where: { id_produk } })
    await tx.persediaan.deleteMany({ where: { id_produk } })
    await tx.userStory.deleteMany({ where: { id_produk } })
    await tx.produk.delete({ where: { id_produk } })
  })
}
