import type Product from '#models/product'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProductTransformer extends BaseTransformer<Product> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'categoryId',
      'sku',
      'name',
      'description',
      'purchasePrice',
      'salePrice',
      'stock',
      'minStock',
      'isActive',
      'createdAt',
      'updatedAt',
    ])
  }
}