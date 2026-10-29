import db from '@adonisjs/lucid/services/db'

import Purchase from '#models/purchase'
import Product from '#models/product'
import InventoryMovement from '#models/inventory_movement'

export default class PurchaseService {
  static async receive(purchaseId: number) {
    return db.transaction(async (trx) => {
      const purchase = await Purchase.query({ client: trx })
        .where('id', purchaseId)
        .preload('details')
        .firstOrFail()

      if (purchase.status !== 'draft') {
        throw new Error('Only draft purchases can be received')
      }

        for (const detail of purchase.details) {
        const productId = Number(detail.productId)

        const product = await Product.query({ client: trx })
            .where('id', productId)
            .forUpdate()
            .firstOrFail()

        const previousStock = product.stock
        const newStock = previousStock + detail.quantity

        product.stock = newStock
        product.useTransaction(trx)

        await product.save()

        await InventoryMovement.create(
            {
            productId: product.id,
            purchaseId: purchase.id,
            saleId: null,
            type: 'purchase',
            quantity: detail.quantity,
            previousStock,
            newStock,
            },
            { client: trx }
        )
        
        }

      purchase.status = 'received'
      purchase.useTransaction(trx)

      await purchase.save()

      return purchase
    })
  }
}