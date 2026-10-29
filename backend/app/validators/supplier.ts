import vine from '@vinejs/vine'

export const createSupplierValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(150),

  email: vine
    .string()
    .trim()
    .email()
    .maxLength(255)
    .nullable()
    .optional(),

  phone: vine
    .string()
    .trim()
    .maxLength(30)
    .nullable()
    .optional(),

  address: vine
    .string()
    .trim()
    .nullable()
    .optional(),
})

export const updateSupplierValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(150)
    .optional(),

  email: vine
    .string()
    .trim()
    .email()
    .maxLength(255)
    .nullable()
    .optional(),

  phone: vine
    .string()
    .trim()
    .maxLength(30)
    .nullable()
    .optional(),

  address: vine
    .string()
    .trim()
    .nullable()
    .optional(),
})