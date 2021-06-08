const googleIt = require('google-it');
const fs = require('fs');

const options = {
  'no-display': true
}

async function parseQuery(query) {
  let links = [];

  try {
    for (let pageNum = 0; pageNum < 10; pageNum++) {
      await new Promise((resolve, reject) => { 
        googleIt({ ...options, start: pageNum, query }).then(res => {
          links.push(res);

          resolve();
        }).catch(err => {
          reject(err);
        })
      });
    }
  } catch(err) {
    console.log(err);
  }

  if (links.length) {
    fs.writeFile(`./outputs/${query.replace(/ /g, '_')}-google.json`, JSON.stringify(links), (err) => {
      if (err) return console.error(err);

      console.log('Links written to output file');
    });
  } else {
    console.log('No links found');
  }
}

module.exports = parseQuery;