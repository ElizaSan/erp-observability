import Customer from '#models/customer'
import CustomerTransformer from '#transformers/customer_transformer'
import {
  createCustomerValidator,
  updateCustomerValidator,
} from '#validators/customer'
import type { HttpContext } from '@adonisjs/core/http'

export default class CustomersController {
  async index({ serialize }: HttpContext) {
    const customers = await Customer.all()

    return serialize(CustomerTransformer.transform(customers))
  }

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createCustomerValidator)

    const customer = await Customer.create(payload)

    return serialize(CustomerTransformer.transform(customer))
  }

  async show({ params, serialize }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    return serialize(CustomerTransformer.transform(customer))
  }

  async update({ params, request, serialize }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    const payload = await request.validateUsing(updateCustomerValidator)

    customer.merge(payload)
    await customer.save()

    return serialize(CustomerTransformer.transform(customer))
  }

  async destroy({ params, response }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)

    await customer.delete()

    return response.status(204).send(null)
  }
}