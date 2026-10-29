import type Purchase from '#models/purchase'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class PurchaseTransformer extends BaseTransformer<Purchase> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'supplierId',
        'userId',
        'total',
        'status',
        'createdAt',
        'updatedAt',
      ]),
      details: this.resource.details?.map((detail) => ({
        id: detail.id,
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subtotal: detail.subtotal,
      })),
    }
  }
}