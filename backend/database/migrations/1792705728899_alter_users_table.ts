import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role', 20).notNullable().defaultTo('operator')
    })

    this.schema.raw(`
      ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role IN ('admin', 'operator'))
    `)
  }

  async down() {
    this.schema.raw(`
      ALTER TABLE users
      DROP CONSTRAINT IF EXISTS users_role_check
    `)

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
    })
  }
}