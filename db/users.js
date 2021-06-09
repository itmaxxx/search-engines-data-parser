const { pool } = require('./pool');

function addUser({ username, password }) {
	const sql = 'INSERT INTO users (Username, Password) VALUES (?, ?)';
	const data = [username, password];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(`Inserted user with ID: ${results.insertId}`);

			resolve(results.insertId);
		});
	});
}

function getUserByUsername({ username }) {
	const sql = 'SELECT * FROM users WHERE Username=(?)';
	const data = [username];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			resolve(results);
		});
	});
}

module.exports = { addUser, getUserByUsername };
