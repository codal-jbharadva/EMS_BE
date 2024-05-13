import mysql from "mysql2";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jayesh',
    database:'event_management',
})

module.exports = pool.promise();