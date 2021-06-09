const parseGoogle = require('./src/search_engines/google');
const parseYandex = require('./src/search_engines/yandex');
const parseWebsite = require('./src/parseWebsite');
const fs = require('fs');

async function start() {
  let query = 'купить сайдинг одесса';

  let glinks = await parseGoogle(query);
  let ylinks = await parseYandex(query);
  let contacts = [];

  console.log({ glinks: glinks ? glinks.length : 0, ylinks: ylinks ? ylinks.length : 0 });

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
    fs.writeFile(`./outputs/${query.replace(/ /g, '_')}-contacts.json`, JSON.stringify(contacts), (err) => {
      if (err) return console.error(err);
  
      console.log('Contacts written to output file');
    });
  }
}

start();

async function testWebsitesParsing() {
  // await parseWebsite('https://epicentrk.ua/shop/sayding/'); // tel,
  // await parseWebsite('https://www.alta-profil.ru/catalog/saiding/'); // tel, mailto (dynamic js, only with selenium)
  // await parseWebsite('https://prom.ua/Sajding'); // none
  // await parseWebsite('https://www.olx.ua/odessa/q-%D1%81%D0%B0%D0%B9%D0%B4%D0%B8%D0%BD%D0%B3/'); // none
  // await parseWebsite('https://sholvi.com.ua/product/vinilovii-sayding/'); // Text fields, tel
  // await parseWebsite('https://zakupka.com/odessa/t/sayding-4857/'); // Text fields
  // await parseWebsite('https://roofer.com.ua/category/sayding-vinilovyy/'); // Text fields, viber
  await parseWebsite('https://e-dom.by/catalog/sayding/');
}

// testWebsitesParsing();