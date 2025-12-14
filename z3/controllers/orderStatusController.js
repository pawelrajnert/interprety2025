const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')

exports.getStatuses = async (req, res) => {
    try {
        const statuses = await knex('order_statuses').select('*');

        if (statuses.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'No order statuses found.'
            });
        }

        res.status(StatusCodes.OK).json(statuses);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error getting order statuses'
        });
    }
}