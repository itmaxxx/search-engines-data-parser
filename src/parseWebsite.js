const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

async function parseWebsite(url) {
	try {
		const response = await axios.get(url, { timeout: 10000 });
		const $ = cheerio.load(response.data);

		let phones = [];
		let emails = [];

		// fs.writeFile(url.replace(/(http:\/\/|https:\/\/)/g, '').replace(/\//g, '_').replace(/\./g, '_') + '.txt', await (await driver.findElement(By.css('body'))).getAttribute('innerText'), (err) => {
		//   if (err) throw(err);

		//   console.log('Written source');
		// });

		let links = $('a');

		for (let i = 0; i < links.length; i++) {
			const link = links[i];

			try {
				let href = link.attribs.href;

				if (href === '#') {
					continue;
				}

				if (
					href.indexOf('tel:') !== -1 ||
					href.indexOf('viber://chat') !== -1
				) {
					console.log(href);

					phones.push(href);
				} else if (href.indexOf('mailto:') !== -1) {
					console.log(href);

					emails.push(href);
				}
			} catch (err) {
				continue;
			}
		}

		// let body = $('body').text();

		// fs.writeFile(`./text/${url.replace(/\//g, '')}-text.txt`, body, (err) => {
		//   if (err) return console.error(err);

		//   console.log('Body text written to output file');
		// });

		phones = phones.filter((p, pos) => phones.indexOf(p) === pos);
		emails = emails.filter((p, pos) => emails.indexOf(p) === pos);

		console.log({ url, phones, emails });

		return { url, phones, emails };
	} catch (err) {
		console.error(err);
	}
}

module.exports = parseWebsite;
