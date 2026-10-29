import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')

      table.string('sku', 50).notNullable().unique()
      table.string('name', 150).notNullable()
      table.text('description').nullable()

      table.decimal('purchase_price', 12, 2).notNullable()
      table.decimal('sale_price', 12, 2).notNullable()

      table.integer('stock').notNullable().defaultTo(0)
      table.integer('min_stock').notNullable().defaultTo(0)

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.check('purchase_price >= 0', [], 'products_purchase_price_check')
      table.check('sale_price >= 0', [], 'products_sale_price_check')
      table.check('stock >= 0', [], 'products_stock_check')
      table.check('min_stock >= 0', [], 'products_min_stock_check')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}