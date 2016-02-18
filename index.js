
'use strict';

const P = require('bluebird');
const component = require('stampit');
const async = require('async');
const check = require('check-types');
const utilFact = require('./lib/utils');

module.exports = (spec) => {
  return component()
    .init(function() {
      spec = spec || {};
      const resolver = P.pending();
      const self = this;
      this._badWords = spec.badWords;
      this._store = spec.store;
      this._key = spec.key || 'mr_rogers_banned';
      this._utils = utilFact(this._store, this._key);

      this._utils.fetchStoredWords()
        .then((badWords) => {
          if (badWords) {
            self._badWords = badWords;
            resolver.resolve(self);
          } else {
            self._badWords = self._utils.fetchDefaultWords();
            self._utils.persistWords(self._badWords)
              .then(() => resolver.resolve(self))
              .catch((err) => esolver.reject(err));
          }
        }).catch((err) => resolver.reject(err));
      return resolver.promise;
    }).methods({

      /**
       * Determines if the given text contains a restricted word
       *
       * @param  {String} text The text to search
       * @return {Promise}
       */
      detect(text) {
        const self = this;
        const resolver = P.pending();

        if (text) {
          const searchable = text.toLowerCase();
          async.detect(self._badWords, detectWord, (result) => {
            if (result) {
              resolver.resolve(true);
            } else {
              resolver.resolve(false);
            }
          });

          function detectWord(word, callback) {
            const key = word.toLowerCase().trim();
            const regex = new RegExp(`(\\s|^)${key}(\\s|$|\\W|\\d|_|-)`);
            var contains = regex.test(searchable);
            if (contains === true) {
              console.log(`Contains ${word}`);
            }
            return callback(contains);
          }
        } else {
          resolver.resolve(false);
        }
        return resolver.promise;
      },

      /**
       * Allows a word to appear in subsequent detection attempts
       *
       * @param  {Array} words An array of words to be whitelisted
       * @return {Promise}
       */
      allow(words) {
        words = (check.array(words)) ? words : [ words ];
        const self = this;
        const resolver = P.pending();
        let index;

        words.forEach((word, i) => {
          let index = self._badWords.indexOf(word);
          if (index > -1) {
            self._badWords.splice(word);
          }
        });

        this._utils.persistWords(self._badWords)
          .then(() => resolver.resolve())
          .catch((err) => resolver.reject(err));

        return resolver.promise;
      },

      /**
       * Forbids an otherwise, clean word from appearing in subsequent detection attempts
       *
       * @param  {Array} words An array of words to be blacklisted
       * @return {Promise}
       */
      forbid(words) {
        words = (check.array(words)) ? words : [ words ];
        const self = this;
        const resolver = P.pending();

        words.forEach((word) => {
          let index = self._badWords.indexOf(word);
          if (index === -1) {
            self._badWords.push(word);
          }
        });

        this._utils.persistWords(self._badWords)
          .then(() => resolver.resolve())
          .catch((err) => resolver.reject(err));

        return resolver.promise;
      },

      /**
       * Utilize the default set of words for subsequent detection operations
       *
       * @return {Promise}
       */
      useDefaults() {
        const resolver = P.pending();
        const defaults = this._utils.fetchDefaultWords();

        this._badWords = defaults;

        this._utils.persistWords(this._badWords)
          .then(() => resolver.resolve())
          .catch((err) => resolver.reject(err));

        return resolver.promise;
      },

      fetchDefaults() {
        return this._utils.fetchDefaultWords();
      },

      /**
       * Returns a list of all the currently blacklisted words
       *
       * @return {Array} badWords An array of the blacklisted words
       */
      fetchForbidden() {
        return this._badWords;
      }
    }).create();
}
