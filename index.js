const parseGoogle = require('./src/SearchEngines/google');
const parseYandex = require('./src/SearchEngines/yandex');

async function start() {
  let query = 'купить сайдинг';

  await parseGoogle(query);
  await parseYandex(query);
}

start();