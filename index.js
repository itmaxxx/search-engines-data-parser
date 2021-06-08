const parseGoogle = require('./src/SearchEngines/google');
const parseYandex = require('./src/SearchEngines/yandex');
const parseWebsite = require('./src/parseWebsite');

async function start() {
  // let query = 'купить сайдинг одесса';

  // await parseGoogle(query);
  // await parseYandex(query);

  parseWebsite('https://epicentrk.ua/shop/sayding/'); // href="tel:"
}

start();