const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')
const {isTextEmpty, isMoreThanZero} = require("../validation/validateData");

exports.getAllProducts = async (req, res) => {
    try {
        const product = await knex('products')
            .select('products.*', 'categories.name as category').join('categories', 'products.category_id', 'categories.id')

        if (product.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No products found',
            })
        }

        res.status(StatusCodes.OK).json(product)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Error getting products list',
        })
    }
}

exports.getOneProduct = async (req, res) => {
    try {
        const product = await knex('products')
            .select('products.*', 'categories.name as category').join('categories', 'products.category_id', 'categories.id')
            .where('products.id', req.params.id).first()

        if (product.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No products found',
            })
        }

        res.status(StatusCodes.OK).json(product)

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Error getting products list',
        })
    }
}


exports.addProducts = async (req, res) => {
    try {
        const {name, description, price, weight, category_id} = req.body

        if (!isTextEmpty(name) || !isTextEmpty(description)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while adding product to list, values cannot be empty.',
            })
        }

        if (!isMoreThanZero(price) || !isMoreThanZero(weight)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while adding product to list, values must be more than 0.',
            })
        }

        const getCategory = await knex('categories')
            .where('id', category_id).first()

        if (!getCategory) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while adding product to list, cannot find category',
            })
        }

        const [id] = await knex('products').insert({
            name,
            description,
            price,
            weight,
            category_id
        }).returning('id')


        res.status(StatusCodes.CREATED).json({
            message: 'Product added successfully',
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error while adding product to list. Wrong request provided.',
        })
    }
}

exports.updateOneProduct = async (req, res) => {
    try {
        const {name, description, price, weight, category_id} = req.body

        const prodId = req.params.id

        const getProduct = await knex('products').where('products.id', prodId).first()

        if (!getProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Product not found',
            })
        }

        if (!isTextEmpty(name) || !isTextEmpty(description)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while updating product, values cannot be empty.',
            })
        }

        if (!isMoreThanZero(price) || !isMoreThanZero(weight)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while updating product, values must be more than 0.',
            })
        }

        const getCategory = await knex('categories')
            .where('id', category_id).first()

        if (!getCategory) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while updating product, cannot find category',
            })
        }

        await knex('products').where('id', getProduct.id).update({
            name,
            description,
            price,
            weight,
            category_id,
        })

        res.status(StatusCodes.OK).json({
            message: 'Product updated successfully',
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error while updating product, cannot update product.',
        })
    }
}