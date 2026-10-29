import vine from '@vinejs/vine'

export const createCategoryValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(100)
    .unique({ table: 'categories', column: 'name' }),

  description: vine.string().trim().nullable().optional(),
})

export const updateCategoryValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(100)
    .optional(),

  description: vine.string().trim().nullable().optional(),
})