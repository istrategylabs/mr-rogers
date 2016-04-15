
'use strict';

const component = require('stampit');
const P = require('bluebird');
const env = require('./env');
let RX = require('rx');
const currentEnv = env.whereAmI();
let workingWords;
let wordsFile;
let fs;
let words;
let path;
let kj;
let key;

let badWords$ = new Rx.Subject().debounce(1000 /* ms */)); //3600000ms = 1 hour
badWords$.subscribe(
  badwords => {
    const resolver = P.pending();
    persistKJ(kj, key, badWords, resolver);
  },
  err => {
    console.log(`Error: ${err}`);
  });

module.exports = (kj, key) => {

  kj = kj;
  key = key;

  if (currentEnv === env.where.BROWSER) {
    words = require('./words');
    workingWords = words.concat();
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
      if (currentEnv === env.where.SERVER) {
        if(env.lazyWrite){
          badWords$.onNext(badWords);
        } else{
          persistKJ(kj, key, badWords, resolver);
        }
      } else {
        workingWords = badWords;
        setImmediate(() => resolver.resolve());
        return resolver.promise;
      }
    },

    persistKJ(kj, key, badWords, resolver){
      let obj = {};
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
    },
  };

  return Object.create(helpers);

};
