const { pool } = require('./pool');

function getQueries() {
	const sql = 'SELECT * FROM Queries ORDER BY Id DESC LIMIT 50';

	return new Promise((resolve, reject) => {
		pool.query(sql, function (err, results) {
			if (err) reject(err);

			resolve(results);
		});
	});
}

function addQuery({ query, output }) {
	const sql = 'INSERT INTO Queries (Query, Status, Output) VALUES (?, ?, ?)';
	const data = [query, 'new', output];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(`Inserted query with ID: ${results.insertId}`);

			resolve(results.insertId);
		});
	});
}

function setQueryStatus({ id, status }) {
	const sql = 'UPDATE Queries SET Status=? WHERE Id=?';
	const data = [status, id];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(`Updated status "${status}" of query with ID: ${id}`);

			resolve(results.insertId);
		});
	});
}

function setQueryLinks({ id, links_count }) {
	const sql = 'UPDATE Queries SET LinksCount=? WHERE Id=?';
	const data = [links_count, id];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(
				`Updated links count "${links_count}" of query with ID: ${id}`
			);

			resolve(results.insertId);
		});
	});
}

function setQueryCurrentLink({ id, current_link }) {
	const sql = 'UPDATE Queries SET CurrentLink=? WHERE Id=?';
	const data = [current_link, id];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(
				`Updated current_link "${current_link}" of query with ID: ${id}`
			);

			resolve(results.insertId);
		});
	});
}

module.exports = {
	getQueries,
	addQuery,
	setQueryStatus,
	setQueryLinks,
	setQueryCurrentLink
};
