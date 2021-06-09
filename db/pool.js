const mysql = require('mysql2');

const pool = mysql.createPool({
	connectionLimit: 5,
	host: process.env.DBHOST,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DBNAME
});

module.exports = { pool };
