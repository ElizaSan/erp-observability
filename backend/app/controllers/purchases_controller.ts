import db from '@adonisjs/lucid/services/db'
import Purchase from '#models/purchase'
import PurchaseDetail from '#models/purchase_detail'
import PurchaseTransformer from '#transformers/purchase_transformer'
import PurchaseService from '#services/purchase_service'

import {
  createPurchaseValidator,
  updatePurchaseValidator,
} from '#validators/purchase'
import type { HttpContext } from '@adonisjs/core/http'

export default class PurchasesController {
  async index({ serialize }: HttpContext) {
    const purchases = await Purchase.query().preload('details')

    return serialize(PurchaseTransformer.transform(purchases))
  }

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createPurchaseValidator)

    const purchase = await db.transaction(async (trx) => {
      const total = payload.details.reduce(
        (sum, detail) => sum + detail.quantity * detail.unitPrice,
        0
      )

      const purchase = await Purchase.create(
        {
          supplierId: payload.supplierId,
          userId: payload.userId,
          total: total.toFixed(2),
          status: 'draft',
        },
        { client: trx }
      )

      for (const detail of payload.details) {
        await PurchaseDetail.create(
          {
            purchaseId: Number(purchase.id),
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice.toFixed(2),
            subtotal: (detail.quantity * detail.unitPrice).toFixed(2),
          },
          { client: trx }
        )
      }

      return purchase
    })

    const purchaseWithDetails = await Purchase.query()
        .where('id', Number(purchase.id))
        .preload('details')
        .firstOrFail()

    return serialize(PurchaseTransformer.transform(purchaseWithDetails))
  }

  async show({ params, serialize }: HttpContext) {
    const purchase = await Purchase.query()
      .where('id', params.id)
      .preload('details')
      .firstOrFail()

    return serialize(PurchaseTransformer.transform(purchase))
  }

  async update({ params, request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(updatePurchaseValidator)

    const purchase = await Purchase.query()
      .where('id', params.id)
      .firstOrFail()

    if (purchase.status !== 'draft') {
    return response.status(409).send({
        errors: [
        {
            message: 'Only draft purchases can be updated',
            rule: 'business_rule',
            field: 'status',
        },
        ],
    })
    }

    await db.transaction(async (trx) => {
      purchase.useTransaction(trx)

      if (payload.supplierId !== undefined) {
        purchase.supplierId = payload.supplierId
      }

      if (payload.details !== undefined) {
        const total = payload.details.reduce(
          (sum, detail) => sum + detail.quantity * detail.unitPrice,
          0
        )

        purchase.total = total.toFixed(2)

        await PurchaseDetail.query({ client: trx })
          .where('purchaseId', Number(purchase.id))
          .delete()

        for (const detail of payload.details) {
          await PurchaseDetail.create(
            {
              purchaseId: Number(purchase.id),
              productId: detail.productId,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice.toFixed(2),
              subtotal: (detail.quantity * detail.unitPrice).toFixed(2),
            },
            { client: trx }
          )
        }
      }

      await purchase.save()
    })

    const purchaseWithDetails = await Purchase.query()
        .where('id', Number(purchase.id))
        .preload('details')
        .firstOrFail()

        return serialize(PurchaseTransformer.transform(purchaseWithDetails))
    }

    async destroy({ params, response }: HttpContext) {
        const purchase = await Purchase.query()
        .where('id', params.id)
        .firstOrFail()

        if (purchase.status !== 'draft') {
        return response.status(409).send({
            errors: [
            {
                message: 'Only draft purchases can be deleted',
                rule: 'business_rule',
                field: 'status',
            },
            ],
        })
        }

        await purchase.delete()

        return response.status(204).send(null)
    }

    async receive({ params, response, serialize }: HttpContext) {
    try {
        const purchase = await PurchaseService.receive(Number(params.id))

        const purchaseWithDetails = await Purchase.query()
        .where('id', Number(purchase.id))
        .preload('details')
        .firstOrFail()

        return serialize(PurchaseTransformer.transform(purchaseWithDetails))
    } catch (error) {
        if (
        error instanceof Error &&
        error.message === 'Only draft purchases can be received'
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

        throw error
    }
    }
}