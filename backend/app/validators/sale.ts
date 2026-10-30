import vine from '@vinejs/vine'

const saleDetailValidator = vine.object({
  productId: vine.number().exists({
    table: 'products',
    column: 'id',
  }),

  quantity: vine.number().withoutDecimals().min(1),

  unitPrice: vine.number().min(0),
})

export const createSaleValidator = vine.create({
  customerId: vine.number().exists({
    table: 'customers',
    column: 'id',
  }),

  userId: vine.number().exists({
    table: 'users',
    column: 'id',
  }),

  details: vine.array(saleDetailValidator).minLength(1),
})

export const updateSaleValidator = vine.create({
  customerId: vine
    .number()
    .exists({
      table: 'customers',
      column: 'id',
    })
    .optional(),

  details: vine.array(saleDetailValidator).minLength(1).optional(),
})