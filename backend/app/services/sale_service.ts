import db from '@adonisjs/lucid/services/db'

import Sale from '#models/sale'
import Product from '#models/product'
import InventoryMovement from '#models/inventory_movement'

export default class SaleService {
  static async complete(saleId: number) {
    return db.transaction(async (trx) => {
      const sale = await Sale.query({ client: trx })
        .where('id', saleId)
        .preload('details')
        .firstOrFail()

      if (sale.status !== 'draft') {
        throw new Error('Only draft sales can be completed')
      }

      for (const detail of sale.details) {
        const productId = Number(detail.productId)

        const product = await Product.query({ client: trx })
          .where('id', productId)
          .forUpdate()
          .firstOrFail()

        const previousStock = product.stock

        if (previousStock < detail.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.id}`
          )
        }

        const newStock = previousStock - detail.quantity

        product.stock = newStock
        product.useTransaction(trx)

        await product.save()

        await InventoryMovement.create(
          {
            productId: product.id,
            purchaseId: null,
            saleId: sale.id,
            type: 'sale',
            quantity: detail.quantity,
            previousStock,
            newStock,
          },
          { client: trx }
        )
        
      }

      sale.status = 'confirmed'
      sale.useTransaction(trx)

      await sale.save()

      return sale
    })
  }
}