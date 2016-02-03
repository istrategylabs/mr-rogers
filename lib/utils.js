
'use strict';

const component = require('stampit');
const P = require('bluebird');
const env = require('./env');
const currentEnv = env.whereAmI();
let workingWords;
let wordsFile;
let fs;
let words;
let path;

module.exports = (kj, key) => {

  if (currentEnv === env.where.BROWSER) {
     workingWords = words.concat();
     words = require('./words');
  } else {
    fs = require('fs');
    path = require('path');
    wordsFile = path.join(__dirname, 'words.json');
  }

  const helpers = {

    fetchDefaultWords() {
      if (currentEnv === env.where.SERVER) {
        let parsedWords;
        const data = fs.readFileSync(wordsFile);
        try {
          parsedWords = JSON.parse(data.toString()).words;
          return parsedWords;
        } catch(e) {
          return;
        }
      } else {
        return words;
      }
    },

    fetchStoredWords() {
      const resolver = P.pending();
      if (currentEnv === env.where.SERVER) {
        if (kj) {
          return kj.get(key);
        } else {
          fs.readFile(wordsFile, (err, data) => {
            if (err) {
              resolver.reject(err);
            } else {
              resolver.resolve(JSON.parse(data.toString()));
            }
          });
          return resolver.promise;
        }
      } else {
        setImmediate(() => resolver.resolve(workingWords));
        return resolver.promise;
      }
    },

    persistWords(badWords) {
      const resolver = P.pending();
      let obj = {};

      if (currentEnv === env.where.SERVER) {
        if (kj) {
          return kj.set(key, badWords);
        } else {
          obj.words = JSON.stringify(badWords, false, 4);
          fs.writeFile(wordsFile, obj, (err) => {
            if (err) {
              resolver.reject(err);
            } else {
              resolver.resolve();
            }
          });
          return resolver.promise;
        }
      } else {
        workingWords = badWords;
        setImmediate(() => resolver.resolve());
        return resolver.promise;
      }
    }
  };

  return helpers;

};
