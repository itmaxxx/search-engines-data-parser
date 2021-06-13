const express = require('express');
const fs = require('fs');
const {
	addQuery,
	setQueryStatus,
	setQueryLinks,
	setQueryCurrentLink,
	deleteQuery,
	getQuery
} = require('../../db/queries');
const router = express.Router();
const parseGoogle = require('../search_engines/google');
const parseYandex = require('../search_engines/yandex');
const parseWebsite = require('../parseWebsite');
const path = require('path');

// api/parser/parse
router.post('/parse', async (req, res) => {
	let query = req.body.query;

	if (!query.length) {
		return res.json({ error: true, message: '"query" is empty' });
	}

	let outputFileName = `${Date.now()}-contacts.json`;

	let queryID = await addQuery({ query, output: outputFileName });

	res.json({
		ok: true,
		status: 'Запрос добавлен, начинается парсинг поисковиков'
	});

	try {
		let glinks = await parseGoogle(query);
		let ylinks = await parseYandex(query);
		let contacts = [];
		let links_count = glinks ? glinks.length : 0 + ylinks ? ylinks.length : 0;
		let current_link = 0;

		console.log({
			glinks: glinks ? glinks.length : 0,
			ylinks: ylinks ? ylinks.length : 0
		});

		await setQueryStatus({
			id: queryID,
			status: 'Парсинг П.С. завершен. Начинается парсинг сайтов.'
		});
		await setQueryLinks({ id: queryID, links_count });

		if (glinks) {
			for (let i = 0; i < glinks.length; i++) {
				let contact = await parseWebsite(glinks[i].link);

				current_link++;

				setQueryCurrentLink({ id: queryID, current_link });

				if (contact) {
					contacts.push(contact);
				}
			}
		}

		if (ylinks) {
			for (let i = 0; i < ylinks.length; i++) {
				let contact = await parseWebsite(ylinks[i].href);

				current_link++;

				setQueryCurrentLink({ id: queryID, current_link });

				if (contact) {
					contacts.push(contact);
				}
			}
		}

		await setQueryStatus({
			id: queryID,
			status: 'Парсинг сайтов закончен. Запись в файл с результатами.'
		});

		if (contacts.length) {
			fs.writeFile(
				`./outputs/${outputFileName}`,
				JSON.stringify(contacts),
				(err) => {
					if (err) return console.error(err);

					console.log('Contacts written to output file');

					setQueryStatus({
						id: queryID,
						status: 'Завершен'
					});
				}
			);
		}
	} catch (err) {
		console.error(err);
	}
});

router.delete('/query', async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.json({ error: true, message: 'id should not be empty' });
	}

	try {
		await deleteQuery({ id });

		return res.json({ id });
	} catch (e) {
		return res.json({ error: true, message: e.message });
	}
});

module.exports = router;
