import { PurchaseSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Supplier from '#models/supplier'
import User from '#models/user'
import PurchaseDetail from '#models/purchase_detail'
import InventoryMovement from '#models/inventory_movement'

export default class Purchase extends PurchaseSchema {
  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PurchaseDetail, {
    foreignKey: 'purchaseId',
  })
  declare details: HasMany<typeof PurchaseDetail>

  @hasMany(() => InventoryMovement)
  declare inventoryMovements: HasMany<typeof InventoryMovement>
}