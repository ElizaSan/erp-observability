import db from '@adonisjs/lucid/services/db'
import Product from '#models/product'
import ProductTransformer from '#transformers/product_transformer'
import {
  createProductValidator,
  updateProductValidator,
} from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {

    async index({ serialize }: HttpContext) {
        const products = await Product.all()

        return serialize(ProductTransformer.transform(products))
    }

    async store({ request, serialize }: HttpContext) {
        const payload = await request.validateUsing(createProductValidator)

        const { purchasePrice, salePrice, ...productData } = payload

        const product = await Product.create({
            ...productData,
            purchasePrice: String(purchasePrice),
            salePrice: String(salePrice),
        })

        return serialize(ProductTransformer.transform(product))
    }

    async show({ params, serialize }: HttpContext) {
        const product = await Product.findOrFail(params.id)

        return serialize(ProductTransformer.transform(product))
    }

    async update({ params, request, response, serialize }: HttpContext) {
        const product = await Product.findOrFail(params.id)
        const payload = await request.validateUsing(updateProductValidator)

        if (payload.sku) {
        const existingProduct = await db
            .from('products')
            .where('sku', payload.sku)
            .whereNot('id', Number(product.id))
            .first()

        if (existingProduct) {
            return response.status(422).send({
            errors: [
                {
                message: 'The sku has already been taken',
                rule: 'database.unique',
                field: 'sku',
                },
            ],
            })
        }
        }

        const { purchasePrice, salePrice, ...productData } = payload

        product.merge(productData)

        if (purchasePrice !== undefined) {
        product.purchasePrice = String(purchasePrice)
        }

        if (salePrice !== undefined) {
        product.salePrice = String(salePrice)
        }

        await product.save()

        return serialize(ProductTransformer.transform(product))
    }

    async destroy({ params, response }: HttpContext) {
        const product = await Product.findOrFail(params.id)

        await product.delete()

        return response.status(204).send(null)
    }
}