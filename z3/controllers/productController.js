const {StatusCodes} = require('http-status-codes')
const knex = require('../db/setDbCon')
const {isTextEmpty, isMoreThanZero} = require("../validation/validateData");
const dotenv = require('dotenv')

dotenv.config();
const GROQ_KEY = process.env.GROQ_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL;

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
        console.log(product);
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
        const {name, description, unit_price, unit_weight, category_id} = req.body

        if (isTextEmpty(name) || isTextEmpty(description)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while adding product to list, values cannot be empty.',
            })
        }

        if (!isMoreThanZero(unit_price) || !isMoreThanZero(unit_weight)) {
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
            unit_price,
            unit_weight,
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
        const {name, description, unit_price, unit_weight, category_id} = req.body

        const prodId = req.params.id

        const getProduct = await knex('products').where('products.id', prodId).first()

        if (!getProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Product not found',
            })
        }

        if (isTextEmpty(name) || isTextEmpty(description)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Error while updating product, values cannot be empty.',
            })
        }

        if (!isMoreThanZero(unit_price) || !isMoreThanZero(unit_weight)) {
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
            unit_price,
            unit_weight,
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

exports.getSeoDescription = async (req, res) => {
    const productId = req.params.id
    const getProduct = await knex('products').where('products.id', productId).first()
    if (!getProduct) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'Product not found',
        })
    }
    const seoHtml = await groqDescription(getProduct);
    res.status(200).json({
        productId: getProduct.id,
        seoDescription: seoHtml
    });
}

async function groqDescription(product) {
    let prompt = `
    Jesteś ekspertem SEO.
    Na podstawie danych o produkcie: nazwa:${product.name}, opis: ${product.description}, cena jednostkowa: ${product.unit_price}, waga jednostkowa: ${product.unit_weight}, kategoria: ${product.category} napisz opis tego produktu w formie HTML zgodnie z wymaganiami SEO dla sklepu internetowego.
       
        Wymagania:
        1. Użyj tagów HTML.
        2. NIE używaj znaczników Markdown, znaków końca linii, znaków \\ Zwróć czysty kod HTML w jednym wierszu.
        3. Tekst ma być zachęcający do zakupu i zawierać słowa kluczowe z nazwy produktu.
        4. Struktura: Krótki wstęp, lista zalet (ul), podsumowanie.
        5. Na początku napisz doctype.
     `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    });
    const data = await response.json();
    const description = data.choices[0]?.message?.content?.trim();
    return description;
}