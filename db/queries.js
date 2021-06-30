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

function getQuery({ id }) {
	const sql = 'SELECT * FROM Queries WHERE Id=?';
	const data = [id];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			resolve(results);
		});
	});
}

function addQuery({ query, output, excel }) {
	const sql =
		'INSERT INTO Queries (Query, Status, Output, Excel) VALUES (?, ?, ?, ?)';
	const data = [query, 'Новый', output, excel];

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

			resolve(results);
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

			resolve(results);
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

			resolve(results);
		});
	});
}

function deleteQuery({ id }) {
	const sql = 'DELETE FROM Queries WHERE Id=?';
	const data = [id];

	return new Promise((resolve, reject) => {
		pool.query(sql, data, function (err, results) {
			if (err) reject(err);

			console.log(`Deleted query with ID: ${id}`);

			resolve(results);
		});
	});
}

module.exports = {
	getQueries,
	getQuery,
	addQuery,
	setQueryStatus,
	setQueryLinks,
	setQueryCurrentLink,
	deleteQuery
};
