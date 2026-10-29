import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('supplier_id')
        .notNullable()
        .references('id')
        .inTable('suppliers')
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

      table.check('total >= 0', [], 'purchases_total_check')

      table.check(
        "status IN ('draft', 'received', 'cancelled')",
        [],
        'purchases_status_check'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}