import type Sale from '#models/sale'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SaleTransformer extends BaseTransformer<Sale> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'customerId',
        'userId',
        'total',
        'status',
        'createdAt',
        'updatedAt',
      ]),
      details: this.resource.details?.map((detail) => ({
        id: detail.id,
        saleId: detail.saleId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subtotal: detail.subtotal,
      })),
    }
  }
}