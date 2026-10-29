import { SupplierSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Purchase from '#models/purchase'

export default class Supplier extends SupplierSchema {
  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}