import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import SaleService from '#services/sale_service'
import Sale from '#models/sale'
import SaleDetail from '#models/sale_detail'
import SaleTransformer from '#transformers/sale_transformer'
import {
  createSaleValidator,
  updateSaleValidator,
} from '#validators/sale'

export default class SalesController {
  async index({ serialize }: HttpContext) {
    const sales = await Sale.query().preload('details')

    return serialize(SaleTransformer.transform(sales))
  }

  async show({ params, serialize }: HttpContext) {
    const sale = await Sale.query()
      .where('id', params.id)
      .preload('details')
      .firstOrFail()

    return serialize(SaleTransformer.transform(sale))
  }

  async store({ request, serialize }: HttpContext) {
  const payload = await request.validateUsing(createSaleValidator)

  const sale = await db.transaction(async (trx) => {
    const total = payload.details.reduce(
      (sum, detail) => sum + detail.quantity * detail.unitPrice,
      0
    )

    const sale = await Sale.create(
      {
        customerId: payload.customerId,
        userId: payload.userId,
        total: total.toFixed(2),
        status: 'draft',
      },
      { client: trx }
    )

    for (const detail of payload.details) {
      await SaleDetail.create(
        {
          saleId: Number(sale.id),
          productId: detail.productId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice.toFixed(2),
          subtotal: (detail.quantity * detail.unitPrice).toFixed(2),
        },
        { client: trx }
      )
    }

    return sale
  })

  const saleWithDetails = await Sale.query()
    .where('id', Number(sale.id))
    .preload('details')
    .firstOrFail()

  return serialize(SaleTransformer.transform(saleWithDetails))
  }

  async update({ params, request, response, serialize }: HttpContext) {
  const payload = await request.validateUsing(updateSaleValidator)

  const sale = await Sale.query()
    .where('id', params.id)
    .firstOrFail()

  if (sale.status !== 'draft') {
    return response.status(409).send({
      errors: [
        {
          message: 'Only draft sales can be updated',
          rule: 'business_rule',
          field: 'status',
        },
      ],
    })
  }

  await db.transaction(async (trx) => {
    sale.useTransaction(trx)

    if (payload.customerId !== undefined) {
      sale.customerId = payload.customerId
    }

    if (payload.details !== undefined) {
      const total = payload.details.reduce(
        (sum, detail) => sum + detail.quantity * detail.unitPrice,
        0
      )

      sale.total = total.toFixed(2)

      await SaleDetail.query({ client: trx })
        .where('saleId', Number(sale.id))
        .delete()

      for (const detail of payload.details) {
        await SaleDetail.create(
          {
            saleId: Number(sale.id),
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice.toFixed(2),
            subtotal: (detail.quantity * detail.unitPrice).toFixed(2),
          },
          { client: trx }
        )
      }
    }

    await sale.save()
  })

  const saleWithDetails = await Sale.query()
    .where('id', Number(sale.id))
    .preload('details')
    .firstOrFail()

  return serialize(SaleTransformer.transform(saleWithDetails))
  }

  async destroy({ params, response }: HttpContext) {
  const sale = await Sale.query()
    .where('id', params.id)
    .firstOrFail()

  if (sale.status !== 'draft') {
    return response.status(409).send({
      errors: [
        {
          message: 'Only draft sales can be deleted',
          rule: 'business_rule',
          field: 'status',
        },
      ],
    })
  }

  await sale.delete()

  return response.status(204).send(null)
  }

  async complete({ params, response, serialize }: HttpContext) {
    try {
        const sale = await SaleService.complete(Number(params.id))

        const saleWithDetails = await Sale.query()
        .where('id', Number(sale.id))
        .preload('details')
        .firstOrFail()

        return serialize(SaleTransformer.transform(saleWithDetails))
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Only draft sales can be completed'
        ) {
          return response.status(409).send({
            errors: [
              {
                message: error.message,
                rule: 'business_rule',
                field: 'status',
              },
            ],
          })
        }

        if (
          error instanceof Error &&
          error.message.startsWith('Insufficient stock for product')
        ) {
          return response.status(409).send({
            errors: [
              {
                message: error.message,
                rule: 'business_rule',
                field: 'stock',
              },
            ],
          })
        }

        throw error
      }
  }
}