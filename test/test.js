
'use strict';

const test = require('tape');
const co = require('co');
const path = require('path');
const MrRogers = require('../index');
const Store = require('kevin-johnson');
require('dotenv').config({path: path.resolve('./test/test.env')});
const opts = {
  appName: process.env.APP_NAME,
  dbUrl: process.env.DATABASE_URL
};

const errorFunc = (err) => {
  throw err;
};

test('clean text returns false', (t) => {
  co(function*() {
    const text = 'Here is some clean text #obama';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    const hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, false, 'the clean text returns false');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('dirty text returns true', (t) => {
  co(function*() {
    const text = 'Here is some dirty fucking text';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    const hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, true, 'the dirty text returns true');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('forbid a clean word', (t) => {
  co(function*() {
    const text = 'blah blah obama trump';
    const word = 'obama';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    let hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, false, 'no trigger before forbid');
    yield mrRogers.forbid([ word ]);
    hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, true, 'trigger after forbid');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('allow a dirty word', (t) => {
  co(function*() {
    const text = 'blah blah obama trump';
    const word = 'fuck';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    let hasProfanity = yield mrRogers.detect(word);
    t.equal(hasProfanity, true, 'detects the bad word before allow');
    yield mrRogers.allow(word);
    hasProfanity = yield mrRogers.detect(word);
    t.equal(hasProfanity, false, 'does not detect the bad word after allowing');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('do not detect pattern within words', (t) => {
  co(function*() {
    const text = 'Here is some dirtyfuckingtext';
    const word = 'fuck';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    const hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, false, 'it didn\'t detect the bad word');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('detect pattern at the beginning of a string', (t) => {
  co(function*() {
    const text = 'ass Here is some';
    const word = 'fuck';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    const hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, true, 'detects a bad word at the beginning');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('detect pattern at the end of a string', (t) => {
  co(function*() {
    const text = 'Here is the word shit.';
    const word = 'fuck';
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    const hasProfanity = yield mrRogers.detect(text);
    t.equal(hasProfanity, true, 'detects bad word at the end');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

test('fetch default words', (t) => {
  co(function*() {
    const store = yield Store(opts);
    const mrRogers = yield MrRogers({ store });
    yield mrRogers.useDefaults();
    let defaultsLen = mrRogers.fetchDefaults().length;
    yield mrRogers.forbid([ 'beep' ]);
    let forbiddenLen = mrRogers.fetchForbidden().length;
    t.equal(defaultsLen, (forbiddenLen - 1), 'Default length is 1 less than forbidden');
    let foundIndex = mrRogers.fetchDefaults().indexOf('beep');
    t.equal(foundIndex, -1, 'the new word is NOT part of the defaults');
    foundIndex = mrRogers.fetchForbidden().indexOf('beep');
    console.log(foundIndex)
    t.equal((foundIndex > -1), true, 'the new word IS part of the current blacklist');
    yield store.destroy();
    t.end();
  })
  .catch((err) => console.error(err));
});

