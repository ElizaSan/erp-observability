import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('product_id')
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('RESTRICT')

      table
        .bigInteger('purchase_id')
        .nullable()
        .references('id')
        .inTable('purchases')
        .onDelete('RESTRICT')

      table
        .bigInteger('sale_id')
        .nullable()
        .references('id')
        .inTable('sales')
        .onDelete('RESTRICT')

      table.string('type', 20).notNullable()

      table.integer('quantity').notNullable()
      table.integer('previous_stock').notNullable()
      table.integer('new_stock').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()

      table.check(
        "type IN ('purchase', 'sale', 'adjustment')",
        [],
        'inventory_movements_type_check'
      )

      table.check(
        'quantity > 0',
        [],
        'inventory_movements_quantity_check'
      )

      table.check(
        'previous_stock >= 0',
        [],
        'inventory_movements_previous_stock_check'
      )

      table.check(
        'new_stock >= 0',
        [],
        'inventory_movements_new_stock_check'
      )

      table.check(
        `
        (
          type = 'purchase'
          AND purchase_id IS NOT NULL
          AND sale_id IS NULL
          AND new_stock = previous_stock + quantity
        )
        OR
        (
          type = 'sale'
          AND sale_id IS NOT NULL
          AND purchase_id IS NULL
          AND new_stock = previous_stock - quantity
        )
        OR
        (
          type = 'adjustment'
          AND purchase_id IS NULL
          AND sale_id IS NULL
          AND ABS(new_stock::bigint - previous_stock::bigint) = quantity
        )
        `,
        [],
        'inventory_movements_consistency_check'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}