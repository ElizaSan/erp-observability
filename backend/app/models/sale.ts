import { SaleSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Customer from '#models/customer'
import User from '#models/user'
import SaleDetail from '#models/sale_detail'
import InventoryMovement from '#models/inventory_movement'

export default class Sale extends SaleSchema {
  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => SaleDetail, {
    foreignKey: 'saleId',
  })
  declare details: HasMany<typeof SaleDetail>

  @hasMany(() => InventoryMovement)
  declare inventoryMovements: HasMany<typeof InventoryMovement>
}