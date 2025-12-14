const knex = require('./setDbCon')

async function createCategories() {
    const isCreated = await knex.schema.hasTable('categories');

    if (!isCreated) {
        await knex.schema.createTable('categories', (table) => {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.timestamps(true, true);
        });
    }
}

async function createOrderStatuses() {
    const isCreated = await knex.schema.hasTable('order_statuses');

    if (!isCreated) {
        await knex.schema.createTable('order_statuses', (table) => {
            table.increments('id').primary();
            table.string('name', 50).notNullable();
            table.timestamps(true, true);
        });
    }
}

async function createProducts() {
    const isCreated = await knex.schema.hasTable('products');

    if (!isCreated) {
        await knex.schema.createTable('products', (table) => {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.text('description').notNullable();
            table.decimal('unit_price', 10, 2).notNullable();
            table.decimal('unit_weight', 10, 3).notNullable();
            table.integer('category_id').unsigned().notNullable();

            table.foreign('category_id').references('categories.id');

            table.timestamps(true, true);
        });
    }
}

async function createOrders() {
    const isCreated = await knex.schema.hasTable('orders');

    if (!isCreated) {
        await knex.schema.createTable('orders', (table) => {
            table.increments('id').primary()
            table.string('user_name', 255).notNullable()
            table.string('email', 255).notNullable()
            table.string('phone_number', 20).notNullable()
            table.timestamp('confirmation_date').nullable()
            table.integer('status_id').unsigned().notNullable()

            table.foreign('status_id').references('order_statuses.id')

            table.timestamps(true, true)
        });
    }
}

async function createOrderItems() {
    const isCreated = await knex.schema.hasTable('order_items');

    if (!isCreated) {
        await knex.schema.createTable('order_items', (table) => {
            table.increments('id').primary();
            table.integer('order_id').unsigned().notNullable();
            table.integer('product_id').unsigned().notNullable();
            table.integer('quantity').notNullable();
            table.decimal('unit_price', 10, 2).notNullable();

            table.foreign('order_id').references('orders.id').onDelete('CASCADE');
            table.foreign('product_id').references('products.id');

            table.timestamps(true, true);
        });
    }
}

async function createAllTables() {
    try {
        await createCategories()
        await createOrderStatuses()
        await createProducts()
        await createOrders()

    } catch (error) {
        console.error('Error while creating tables', error);
        throw error;
    }
}

async function dropAllTables() {
    await knex.schema.dropTableIfExists('order_items');
    await knex.schema.dropTableIfExists('orders');
    await knex.schema.dropTableIfExists('products');
    await knex.schema.dropTableIfExists('order_statuses');
    await knex.schema.dropTableIfExists('categories');
}

module.exports = {
    createAllTables,
    dropAllTables
};