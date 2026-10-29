import vine from '@vinejs/vine'

export const createProductValidator = vine.create({
  categoryId: vine.number().exists({
    table: 'categories',
    column: 'id',
  }),

  sku: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(50)
    .unique({ table: 'products', column: 'sku' }),

  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(150),

  description: vine.string().trim().nullable().optional(),

  purchasePrice: vine.number().min(0),

  salePrice: vine.number().min(0),

  stock: vine.number().withoutDecimals().min(0).optional(),

  minStock: vine.number().withoutDecimals().min(0).optional(),

  isActive: vine.boolean().optional(),
})

export const updateProductValidator = vine.create({
  categoryId: vine
    .number()
    .exists({
      table: 'categories',
      column: 'id',
    })
    .optional(),

  sku: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(50)
    .optional(),

  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(150)
    .optional(),

  description: vine.string().trim().nullable().optional(),

  purchasePrice: vine.number().min(0).optional(),

  salePrice: vine.number().min(0).optional(),

  minStock: vine.number().withoutDecimals().min(0).optional(),

  isActive: vine.boolean().optional(),
})