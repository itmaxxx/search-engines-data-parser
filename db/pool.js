const mysql = require('mysql2');

const pool = mysql.createPool({
	connectionLimit: 5,
	host: process.env.DBHOST || 'localhost',
	user: process.env.DBUSER || 'root',
	password: process.env.DBPASSWORD || 'root',
	database: process.env.DBNAME || 'SearchEnginesParser'
});

module.exports = { pool };
