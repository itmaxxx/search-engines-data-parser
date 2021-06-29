const xl = require('excel4node');
const path = require('path');

class ExportToExcel {
	constructor(query, fileName, contacts) {
		let wb = new xl.Workbook();

		let ws = wb.addWorksheet(query);

		let style = wb.createStyle({
			font: {
				size: 12
			}
		});
		let styleHeading = wb.createStyle({
			font: {
				size: 24
			}
		});
		let styleBold = wb.createStyle({
			font: {
				size: 12,
				bold: true
			},
			alignment: {
				horizontal: 'center'
			},
			border: {
				left: {
					style: 'thin',
					color: '#000000'
				},
				right: {
					style: 'thin',
					color: '#000000'
				},
				top: {
					style: 'thin',
					color: '#000000'
				},
				bottom: {
					style: 'thin',
					color: '#000000'
				},
				outline: true
			}
		});

		ws.cell(1, 1)
			.string('Результаты парсинга по запросу "' + query + '"')
			.style(styleHeading);

		let y = 3;

		ws.cell(y, 1).string('URL').style(styleBold);
		ws.cell(y, 2).string('Номера телефонов').style(styleBold);
		ws.cell(y, 3).string('Почтовые адреса').style(styleBold);

		y++;

		contacts.forEach((contact) => {
			let _y = y;
			let maxHeight = 0;

			for (let i = 0; i < contact.phones.length; i++) {
				ws.cell(_y + i, 2)
					.string(contact.phones[i])
					.style(style);
			}

			for (let i = 0; i < contact.emails.length; i++) {
				ws.cell(_y + i, 3)
					.string(contact.emails[i])
					.style(style);
			}

			if (contact.phones.length > contact.emails.length) {
				maxHeight = contact.phones.length;
			} else {
				maxHeight = contact.emails.length;
			}

			ws.cell(y, 1).link(contact.url).style(style);

			if (!maxHeight) {
				maxHeight = 1;
			}

			y += maxHeight;
		});

		ws.column(1).setWidth(30);
		ws.column(2).setWidth(30);
		ws.column(3).setWidth(30);

		wb.write(path.join(__dirname + `../../../outputs/${fileName}.xlsx`));
	}
}

module.exports = { ExportToExcel };
