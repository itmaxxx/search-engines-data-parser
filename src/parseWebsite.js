const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const screen = {
  width: 1920,
  height: 1080
};

// Rewrite with cheerio

async function parseWebsite(url) {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();

  try {
    await driver.get(url);

    // fs.writeFile(url.replace(/(http:\/\/|https:\/\/)/g, '').replace(/\//g, '_').replace(/\./g, '_') + '.txt', await (await driver.findElement(By.css('body'))).getAttribute('innerText'), (err) => {
    //   if (err) throw(err);

    //   console.log('Written source');
    // });

    let links = await driver.findElements(By.css('a'));

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      
      try {
        let href = await link.getAttribute('href');

        if (href.indexOf('tel:') !== -1) {
          console.log(href);
        } else if (href.indexOf('mailto:') !== -1) {
          console.log(href);
        }
      } catch(err) {
        continue;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
}

module.exports = parseWebsite;