import { InventoryMovementSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Product from '#models/product'
import Purchase from '#models/purchase'
import Sale from '#models/sale'

export default class InventoryMovement extends InventoryMovementSchema {
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Purchase)
  declare purchase: BelongsTo<typeof Purchase>

  @belongsTo(() => Sale)
  declare sale: BelongsTo<typeof Sale>
}