import type PurchaseDetail from '#models/purchase_detail'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class PurchaseDetailTransformer extends BaseTransformer<PurchaseDetail> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'purchaseId',
      'productId',
      'quantity',
      'unitPrice',
      'subtotal',
    ])
  }
}