import { PurchaseDetailSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Purchase from '#models/purchase'
import Product from '#models/product'

export default class PurchaseDetail extends PurchaseDetailSchema {
  @belongsTo(() => Purchase)
  declare purchase: BelongsTo<typeof Purchase>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}