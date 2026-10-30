import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Categories, 'index'])
        router.post('/', [controllers.Categories, 'store'])
        router.get('/:id', [controllers.Categories, 'show'])
        router.put('/:id', [controllers.Categories, 'update'])
        router.delete('/:id', [controllers.Categories, 'destroy'])
      })
      .prefix('categories')
      .as('categories')
      .use(middleware.auth())
    
    router
      .group(() => {
        router.get('/', [controllers.Products, 'index'])
        router.post('/', [controllers.Products, 'store'])
        router.get('/:id', [controllers.Products, 'show'])
        router.put('/:id', [controllers.Products, 'update'])
        router.delete('/:id', [controllers.Products, 'destroy'])
      })
      .prefix('products')
      .as('products')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Customers, 'index'])
        router.post('/', [controllers.Customers, 'store'])
        router.get('/:id', [controllers.Customers, 'show'])
        router.put('/:id', [controllers.Customers, 'update'])
        router.delete('/:id', [controllers.Customers, 'destroy'])
      })
      .prefix('customers')
      .as('customers')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Suppliers, 'index'])
        router.post('/', [controllers.Suppliers, 'store'])
        router.get('/:id', [controllers.Suppliers, 'show'])
        router.put('/:id', [controllers.Suppliers, 'update'])
        router.delete('/:id', [controllers.Suppliers, 'destroy'])
      })
      .prefix('suppliers')
      .as('suppliers')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Purchases, 'index'])
        router.post('/', [controllers.Purchases, 'store'])
        router.get('/:id', [controllers.Purchases, 'show'])
        router.put('/:id', [controllers.Purchases, 'update'])
        router.delete('/:id', [controllers.Purchases, 'destroy'])
        router.post('/:id/receive', [controllers.Purchases, 'receive'])
      })
      .prefix('purchases')
      .as('purchases')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Sales, 'index'])
        router.post('/', [controllers.Sales, 'store'])
        router.get('/:id', [controllers.Sales, 'show'])
        router.put('/:id', [controllers.Sales, 'update'])
        router.delete('/:id', [controllers.Sales, 'destroy'])
        router.post('/:id/complete', [controllers.Sales, 'complete'])
      })
      .prefix('sales')
      .as('sales')
      .use(middleware.auth())
    
    router
      .group(() => {
        router.post('/adjustments', [controllers.Inventory, 'adjust'])
      })
      .prefix('inventory')
      .as('inventory')
      .use(middleware.auth())


  })
  .prefix('/api/v1')
