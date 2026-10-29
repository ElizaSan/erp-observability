import { ProductSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Category from '#models/category'
import PurchaseDetail from '#models/purchase_detail'
import SaleDetail from '#models/sale_detail'
import InventoryMovement from '#models/inventory_movement'

export default class Product extends ProductSchema {
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => PurchaseDetail)
  declare purchaseDetails: HasMany<typeof PurchaseDetail>

  @hasMany(() => SaleDetail)
  declare saleDetails: HasMany<typeof SaleDetail>

  @hasMany(() => InventoryMovement)
  declare inventoryMovements: HasMany<typeof InventoryMovement>
}