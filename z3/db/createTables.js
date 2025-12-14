const knex = require('setDbCon')

async function createProducts(knex) {
    const isCreated = await knex.schema.hasTable('products')
    if (!isCreated) {
        await knex.schema.createTable("products", table => {
            table.increments('id').primary()
            table.string('name', 255).notNullable()
            table.string('description').notNullable()
            table.decimal('price', 10, 2).notNullable()
            table.decimal("weight", 10, 2).notNullable()

            table.foreign('category_id').references('categories.id');
        })
    }
}

async function createCategories(knex) {
    const isCreated = await knex.schema.hasTable('categories')
    if (!isCreated) {
        await knex.schema.createTable("categories", table => {
            table.increments('id').primary()
            table.string('name', 255).notNullable()
        })
    }
}

async function createOrders(knex) {
    const isCreated = await knex.schema.hasTable('orders')
    if (!isCreated) {
        await knex.schema.createTable("orders", table => {
            table.increments('id').primary()
            table.timestamp('confirmed_at')
            table.string('status', 255).notNullable()
            table.integer('quantity').notNullable()
            table.decimal('unit_price', 10, 2).notNullable()
            table.string('username', 255).notNullable()
            table.string('email', 255).notNullable()
            table.string('phone_number', 255).notNullable()

            table.foreign('status').references('order_statuses.id')
        })
    }
}

async function createOrdersStatus(knex) {
    const isCreated = await knex.schema.hasTable('order_statusses')
    if (!isCreated) {
        await knex.schema.createTable("orders", table => {
            table.increments('id').primary()
            table.string('name', 255).notNullable()

        })
    }
}