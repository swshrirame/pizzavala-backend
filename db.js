const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'pizzavala',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool