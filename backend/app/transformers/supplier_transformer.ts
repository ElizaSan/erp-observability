import type Supplier from '#models/supplier'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SupplierTransformer extends BaseTransformer<Supplier> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'email',
      'phone',
      'address',
      'createdAt',
      'updatedAt',
    ])
  }
}