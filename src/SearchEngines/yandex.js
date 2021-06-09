const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const screen = {
  width: 1920,
  height: 1080
};

async function parseQuery(query) {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
  let links = [];

  try {
    let queryEncoded = encodeURI(query);

    await driver.get(`https://yandex.ua/search/?&text=${queryEncoded}`);

    for (let pageNum = 0; pageNum < 10; pageNum++) {
      console.log(`Opening page #${pageNum}`);

      if (driver.getTitle() === 'Ой!') {
        return console.log('Yandex blocked request');
      }

      let pageLinksCount = 0;
      let searchResults = await driver.findElements(By.css('li.serp-item'));

      for (let i = 0; i < searchResults.length; i++) {
        const el = searchResults[i];

        try {
          let isAd = false;

          try {
            let adEl = await el.findElement(By.css('.Organic-Label_direct'));
            let adText = await adEl.getAttribute('innerText');

            isAd = true;
          } catch (err) {}

          if (isAd) {
            throw('ad');
          }

          let title = await (await el.findElement(By.css('.OrganicTitle-LinkText'))).getAttribute('innerText');
          let linkEl = await el.findElement(By.css('.Link.Link_theme_outer.Path-Item'));
          let href = await linkEl.getAttribute('href');
          let linkText = await linkEl.getText();

          let link = { title, href, linkText };

          links.push(link);

          pageLinksCount++;
        } catch (err) {
          console.error('Search result item bad link');
        }
      }

      console.log(`${pageLinksCount} links parsed from ${searchResults.length} found elements`);

      await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");

      await driver.sleep(1000 + Math.random() * 5000);
      
      let nextPageEl = await driver.findElement(By.css('.link.pager__item_kind_next'));

      await driver.wait(nextPageEl.isDisplayed(), 5000);

      await nextPageEl.click();
    }
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }

  if (links.length) {
    fs.writeFile(`./outputs/${query.replace(/ /g, '_')}-yandex.json`, JSON.stringify(links), (err) => {
      if (err) return console.error(err);

      console.log('Links written to output file');
    });

    return links;
  } else {
    console.log('No links found');
  }
}

module.exports = parseQuery;