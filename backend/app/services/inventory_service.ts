import db from '@adonisjs/lucid/services/db'

import Product from '#models/product'
import InventoryMovement from '#models/inventory_movement'

export default class InventoryService {
  static async adjust(productId: number, quantity: number) {
    return db.transaction(async (trx) => {
      const product = await Product.query({ client: trx })
        .where('id', productId)
        .forUpdate()
        .firstOrFail()

      if (quantity === 0) {
        throw new Error('Adjustment quantity cannot be zero')
      }

      const previousStock = product.stock
      const newStock = previousStock + quantity

      if (newStock < 0) {
        throw new Error(
          `Insufficient stock for product ${product.id}`
        )
      }

      product.stock = newStock
      product.useTransaction(trx)

      await product.save()

      await InventoryMovement.create(
        {
          productId: product.id,
          purchaseId: null,
          saleId: null,
          type: 'adjustment',
          quantity: Math.abs(quantity),
          previousStock,
          newStock,
        },
        { client: trx }
      )

      return product
    })
  }
}
