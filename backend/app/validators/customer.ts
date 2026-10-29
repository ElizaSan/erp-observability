import vine from '@vinejs/vine'

export const createCustomerValidator = vine.create({
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

export const updateCustomerValidator = vine.create({
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