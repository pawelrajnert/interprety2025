const express = require('express')

const db = require('./db/createTables')
const app = express()

const productsApi = require('./api/products')
const categoriesApi = require('./api/categories')
const ordersApi = require('./api/orders')
const orderStatussesApi = require('./api/orderStatusses')
const authController = require('./controllers/authController');
const dbController = require('./controllers/dbController');

app.use(express.json())
app.use(express.text({ limit: '10mb', type: 'text/csv' }));
app.use('/products', productsApi)
app.use('/categories', categoriesApi)
app.use('/orders', ordersApi)
app.use('/status', orderStatussesApi)

app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/token', authController.refreshToken);
app.post('/init', dbController.initDbData);


db.createAllTables()

app.get('/', (req, res) => {
    res.json({
        message: 'Server works'
    })
})

app.listen(2115, () => {
    console.log(`Server started on port: 2115`)
})