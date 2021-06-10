const express = require('express');
const fs = require('fs');
const {
	addQuery,
	setQueryStatus,
	setQueryLinks,
	setQueryCurrentLink
} = require('../../db/queries');
const router = express.Router();
const parseGoogle = require('../search_engines/google');
const parseYandex = require('../search_engines/yandex');
const parseWebsite = require('../parseWebsite');

// api/parser/parse
router.post('/parse', async (req, res) => {
	let query = req.body.query;
	let outputFileName = `${Date.now()}-contacts.json`;

	let queryID = await addQuery({ query, output: outputFileName });

	res.json({ ok: true, status: 'your query is processing' });

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
			status: 'parsed search engines, parsing websites'
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
			status: 'parsed websites, writing to output file'
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
						status: 'finished'
					});
				}
			);
		}
	} catch (err) {
		console.error(err);
	}
});

// api/parser/result
router.get('/result', (req, res) => {
	console.log(req.query);

	res.end('works');
});

module.exports = router;
