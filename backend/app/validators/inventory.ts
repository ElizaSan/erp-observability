import vine from '@vinejs/vine'

export const createInventoryAdjustmentValidator = vine.create({
  productId: vine.number().exists({
    table: 'products',
    column: 'id',
  }),

  quantity: vine.number().withoutDecimals(),
})
