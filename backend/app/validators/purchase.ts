import vine from '@vinejs/vine'

const purchaseDetailValidator = vine.object({
  productId: vine.number().exists({
    table: 'products',
    column: 'id',
  }),

  quantity: vine.number().withoutDecimals().min(1),

  unitPrice: vine.number().min(0),
})

export const createPurchaseValidator = vine.create({
  supplierId: vine.number().exists({
    table: 'suppliers',
    column: 'id',
  }),

  userId: vine.number().exists({
    table: 'users',
    column: 'id',
  }),

  details: vine.array(purchaseDetailValidator).minLength(1),
})

export const updatePurchaseValidator = vine.create({
  supplierId: vine
    .number()
    .exists({
      table: 'suppliers',
      column: 'id',
    })
    .optional(),

  details: vine.array(purchaseDetailValidator).minLength(1).optional(),
})