const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')
const {isTextEmpty, isMoreThanZero} = require("../validation/validateData");

exports.getAllCategories = async (req, res) => {
    try {
        const category = await knex('categories').select('*')

        if (category.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No categories found',
            })
        }

        res.status(StatusCodes.OK).json(category)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Error getting categories list',
        })
    }
}