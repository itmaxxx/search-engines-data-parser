const express = require('express');
const router = express.Router();

// api/parser/parse
router.post('/parse', async (req, res) => {
	let query = req.body.query;

	let outputFileName = `${Date.now()}-contacts.json`;

	return res.json({ ok: true, outputFileName });

	let glinks = await parseGoogle(query);
	let ylinks = await parseYandex(query);
	let contacts = [];

	console.log({
		glinks: glinks ? glinks.length : 0,
		ylinks: ylinks ? ylinks.length : 0
	});

	if (glinks) {
		for (let i = 0; i < glinks.length; i++) {
			let contact = await parseWebsite(glinks[i].link);

			if (contact) {
				contacts.push(contact);
			}
		}
	}

	if (ylinks) {
		for (let i = 0; i < ylinks.length; i++) {
			let contact = await parseWebsite(ylinks[i].href);

			if (contact) {
				contacts.push(contact);
			}
		}
	}

	if (contacts.length) {
		fs.writeFile(
			`./outputs/${outputFileName}`,
			JSON.stringify(contacts),
			(err) => {
				if (err) return console.error(err);

				console.log('Contacts written to output file');
			}
		);
	}
});

// api/parser/result
router.get('/result', (req, res) => {
	console.log(req.query);

	res.end('works');
});

module.exports = router;
