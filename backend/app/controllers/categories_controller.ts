import Category from '#models/category'
import CategoryTransformer from '#transformers/category_transformer'
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CategoriesController {
  async index({ serialize }: HttpContext) {
    const categories = await Category.all()

    return serialize(CategoryTransformer.transform(categories))
  }

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator)

    const category = await Category.create(payload)

    return serialize(CategoryTransformer.transform(category))
  }

  async show({ params, serialize }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    return serialize(CategoryTransformer.transform(category))
  }

  async update({ params, request, response, serialize }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    const payload = await request.validateUsing(updateCategoryValidator)

    if (payload.name) {
      const existingCategory = await db
        .from('categories')
        .where('name', payload.name)
        .whereNot('id', Number(category.id))
        .first()

      if (existingCategory) {
        return response.status(422).send({
          errors: [
            {
              message: 'The name has already been taken',
              rule: 'database.unique',
              field: 'name',
            },
          ],
        })
      }
    }

    category.merge(payload)

    await category.save()

    return serialize(CategoryTransformer.transform(category))
  }

  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)

    await category.delete()

    return response.status(204).send(null)
  }
}