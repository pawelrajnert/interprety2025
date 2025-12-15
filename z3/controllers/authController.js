const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../db/setDbCon');
const {isTextEmpty, isEmailValid, isPhoneValid} = require("../validation/validateData");
const {StatusCodes} = require("http-status-codes");

function generateAccessToken(user) {
    return jwt.sign(
        {id: user.id, role: user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1h'}
    );
}

exports.login = async (req, res) => {
    const {username, password} = req.body;

    const user = await knex('users').where('user_name', username).first();
    if (!user) {
        return res.status(400).json({message: 'Nieprawidłowy login lub hasło'});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({message: 'Nieprawidłowy login lub hasło'});
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
        {id: user.id, role: user.role},
        process.env.REFRESH_TOKEN_SECRET
    );

    await knex('users').where('id', user.id).update({refresh_token: refreshToken});

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
    });
};

exports.refreshToken = async (req, res) => {
    const {token} = req.body;

    if (!token) return res.sendStatus(401);

    const user = await knex('users').where('refresh_token', token).first();
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decodedUser) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken(user);
        res.json({accessToken: accessToken});
    });
};

exports.register = async (req, res) => {
    // try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const {username, email, password, role, phone_number} = req.body;


    if (isTextEmpty(username)) {
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

    await knex('users').insert({
        user_name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || 'KLIENT',
        phone_number: req.body.phone_number
    });
    res.status(201).send('Użytkownik utworzony');
    // } catch (err) {
    //     res.status(500).send('Błąd tworzenia użytkownika');
    // }
};