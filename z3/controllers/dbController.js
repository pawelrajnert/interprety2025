const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')
const fs = require('fs');
const path = require('path');

exports.initDbData = async (req, res) => {
    // const trx = await knex.transaction();
    const products = await knex('products')
        .select('products.*');
    if (products.length !== 0){
        return res.status(400).json();
    }
    const filePath = path.join(__dirname, '..', 'data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let productsToImport;

    try {
        productsToImport = JSON.parse(fileContent);
    } catch (e) {
        return res.status(500).json();
    }
    if (!Array.isArray(productsToImport) || productsToImport.length === 0) {
        return res.status(400).json();
    }

    const categories = await knex('categories').select('id', 'name');
    const categoryMap = new Map();
    categories.forEach(cat => {
        categoryMap.set(cat.name.toLowerCase(), cat.id);
    });

    const productsPayload = [];

    for (const item of productsToImport) {
        if (!item.category) {
            return res.status(400).json();
        }

        const catNameNormalized = item.category.toLowerCase();
        const categoryId = categoryMap.get(catNameNormalized);

        if (!categoryId) {
            return res.status(400).json();
        }

        productsPayload.push({
            name: item.name,
            description: item.description || null,
            unit_price: parseFloat(item.unit_price),
            unit_weight: parseFloat(item.unit_weight),
            category_id: categoryId
        });
    }
    await knex('products').insert(productsPayload);

    res.status(200).json({
        addedCount: productsPayload.length
    });

}