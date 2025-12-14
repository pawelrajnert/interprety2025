const {StatusCodes} = require('http-status-codes');
const knex = require('../db/setDbCon')
const {
    isTextEmpty,
    isEmailValid,
    isPhoneValid,
    isMoreThanZero
} = require("../validation/validateData");


async function getOrderItems(orderId) {
    return await knex('order_items')
        .select('order_items.*', 'products.name as product_name')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', orderId);
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await knex('orders')
            .select('orders.*', 'order_statuses.name as status_name')
            .join('order_statuses', 'orders.status_id', 'order_statuses.id');

        if (orders.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No orders found',
            });
        }

        for (let order of orders) {
            order.items = await getOrderItems(order.id);
        }

        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error getting orders list',
        });
    }
};

exports.getOrdersByStatus = async (req, res) => {
    try {
        const statusId = req.params.id;

        const orders = await knex('orders')
            .select('orders.*', 'order_statuses.name as status_name')
            .join('order_statuses', 'orders.status_id', 'order_statuses.id')
            .where('orders.status_id', statusId);

        if (orders.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No orders found with such status id`,
            });
        }

        for (let order of orders) {
            order.items = await getOrderItems(order.id);
        }

        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error getting orders list by provided status',
        });
    }
};

exports.addOrders = async (req, res) => {
    try {
        const {user_name, email, phone_number, items} = req.body;

        if (isTextEmpty(user_name)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Username cannot be empty',
            });
        }

        if (isTextEmpty(email)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Email cannot be empty',
            });
        }

        if (isTextEmpty(phone_number)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Phone number cannot be empty',
            });
        }

        if (!isEmailValid(email)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Email must be valid',
            });
        }

        if (!isPhoneValid(phone_number)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Phone number must be valid',
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Order must contain at least one product',
            });
        }

        for (let item of items) {
            if (!isMoreThanZero(item.quantity)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Quantity must be a more than 0',
                });
            }

            const product = await knex('products')
                .where('id', item.product_id)
                .first();

            if (!product) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: `Product with id ${item.product_id} not found`,
                });
            }
        }

        const unconfirmedStatus = await knex('order_statuses')
            .where('name', 'UNCONFIRMED')
            .first();

        if (!unconfirmedStatus) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'UNCONFIRMED status not found in database',
            });
        }

        const [orderId] = await knex('orders').insert({
            user_name,
            email,
            phone_number,
            status_id: unconfirmedStatus.id,
            confirmation_date: null
        }).returning('id');

        const newOrderId = orderId.id || orderId;

        for (let item of items) {
            const product = await knex('products')
                .where('id', item.product_id)
                .first();

            await knex('order_items').insert({
                order_id: newOrderId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: product.unit_price
            });
        }

        res.status(StatusCodes.CREATED).json({
            message: 'Order created successfully',
            id: newOrderId
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error while creating order',
        });
    }
};

exports.updateOneOrder = async (req, res) => {
    try {
        const {status_id} = req.body;
        const orderId = req.params.id;

        const order = await knex('orders')
            .select('orders.*', 'order_statuses.name as status_name')
            .join('order_statuses', 'orders.status_id', 'order_statuses.id')
            .where('orders.id', orderId)
            .first();

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Order not found',
            });
        }

        const newStatus = await knex('order_statuses')
            .where('id', status_id)
            .first();

        if (!newStatus) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Order status does not exist',
            });
        }

        const currentStatusName = order.status_name;
        const newStatusName = newStatus.name;

        if (currentStatusName === 'CANCELLED') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Cannot modify cancelled order'
            });
        }

        const statusOrder = ['UNCONFIRMED', 'CONFIRMED', 'COMPLETED'];
        const currentIndex = statusOrder.indexOf(currentStatusName);
        const newIndex = statusOrder.indexOf(newStatusName);

        if (currentIndex > newIndex && newStatusName !== 'CANCELLED') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Cannot set previous order status'
            });
        }

        const updateData = {status_id};

        if (newStatusName === 'CONFIRMED' && !order.confirmation_date) {
            updateData.confirmation_date = new Date();
        }

        await knex('orders')
            .where('id', orderId)
            .update(updateData);

        res.status(StatusCodes.OK).json({
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error updating order status'
        });
    }
};