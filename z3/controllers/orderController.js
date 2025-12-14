const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')
const {isTextEmpty, isMoreThanZero} = require("../validation/validateData");