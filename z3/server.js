const express = require('express')
const db = require('./db/createTables')
const app = express()

const productsApi = require('./api/products')
const categoriesApi = require('./api/categories')
const ordersApi = require('./api/orders')
const orderStatussesApi = require('./api/orderStatusses')

app.use(express.json())
app.use('/products', productsApi)
app.use('/categories', categoriesApi)
app.use('/orders', ordersApi)
app.use('/status', orderStatussesApi)

db.createAllTables()

app.get('/', (req, res) => {
    res.json({
        message: 'Server works'
    })
})

app.listen(2115, () => {
    console.log(`Server started on port: 2115`)
})