import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('customer_id')
        .notNullable()
        .references('id')
        .inTable('customers')
        .onDelete('RESTRICT')

      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')

      table.decimal('total', 12, 2).notNullable().defaultTo(0)

      table
        .string('status', 20)
        .notNullable()
        .defaultTo('draft')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.check(
        'total >= 0',
        [],
        'sales_total_check'
      )

      table.check(
        "status IN ('draft', 'confirmed', 'cancelled')",
        [],
        'sales_status_check'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}