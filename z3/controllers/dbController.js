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

    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "No file uploaded" });
    }

    let productsToImport;

    try {
        const fileContent = req.file.buffer.toString('utf-8');
        productsToImport = JSON.parse(fileContent);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid JSON format in file" });
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