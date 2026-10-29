import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('purchase_id')
        .notNullable()
        .references('id')
        .inTable('purchases')
        .onDelete('CASCADE')

      table
        .bigInteger('product_id')
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('RESTRICT')

      table.integer('quantity').notNullable()

      table.decimal('unit_price', 12, 2).notNullable()

      table.decimal('subtotal', 12, 2).notNullable()

      table.check(
        'quantity > 0',
        [],
        'purchase_details_quantity_check'
      )

      table.check(
        'unit_price >= 0',
        [],
        'purchase_details_unit_price_check'
      )

      table.check(
        'subtotal >= 0',
        [],
        'purchase_details_subtotal_check'
      )

      table.unique(['purchase_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}