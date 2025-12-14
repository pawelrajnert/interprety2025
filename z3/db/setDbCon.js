const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5433,
        user: 'nbd',
        password: 'nbdpassword',
        database: 'nbddb',
    },
});

module.exports = knex;