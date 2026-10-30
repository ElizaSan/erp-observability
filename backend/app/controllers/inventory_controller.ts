import type { HttpContext } from '@adonisjs/core/http'

import InventoryService from '#services/inventory_service'
import { createInventoryAdjustmentValidator } from '#validators/inventory'

export default class InventoryController {
  async adjust({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      createInventoryAdjustmentValidator
    )

    try {
      const product = await InventoryService.adjust(
        payload.productId,
        payload.quantity
      )

      return response.ok({
        data: {
          productId: product.id,
          stock: product.stock,
        },
      })
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Adjustment quantity cannot be zero'
      ) {
        return response.status(422).send({
          errors: [
            {
              message: error.message,
              rule: 'business_rule',
              field: 'quantity',
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
