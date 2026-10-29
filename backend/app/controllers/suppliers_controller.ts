import Supplier from '#models/supplier'
import SupplierTransformer from '#transformers/supplier_transformer'
import {
  createSupplierValidator,
  updateSupplierValidator,
} from '#validators/supplier'
import type { HttpContext } from '@adonisjs/core/http'

export default class SuppliersController {
  async index({ serialize }: HttpContext) {
    const suppliers = await Supplier.all()

    return serialize(SupplierTransformer.transform(suppliers))
  }

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createSupplierValidator)

    const supplier = await Supplier.create(payload)

    return serialize(SupplierTransformer.transform(supplier))
  }

  async show({ params, serialize }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)

    return serialize(SupplierTransformer.transform(supplier))
  }

  async update({ params, request, serialize }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const payload = await request.validateUsing(updateSupplierValidator)

    supplier.merge(payload)
    await supplier.save()

    return serialize(SupplierTransformer.transform(supplier))
  }

  async destroy({ params, response }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)

    await supplier.delete()

    return response.status(204).send(null)
  }
}