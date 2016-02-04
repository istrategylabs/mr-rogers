
# Mr Rogers

A small utility for screening out bad words. The base list is the same as a list
used by Google (for certain things) and was published by another dev

http://fffff.at/googles-official-list-of-bad-words/

ISL takes no position on the usage/context of the list provided. We provide the list "as is" and you should add/remove items as you see fit.

### Quick Start
```javascript
  // mr rogers uses a posgtres backed store
  const MrRogers = require('mr-rogers');
  const clean = 'some clean text';
  const dirty = 'some dirty ass text';
  let mrRogers;

  MrRogers()
    .then((m) => {
        mrRogers = m;
        return mrRogers.detect(clean);
    }).then((hasProfanity) => {
        console.log(hasProfanity); // false
        return mrRogers.detect(dirty);
    }).then((hasProfanity) => {
        console.log(hasProfanity); // true
    }).catch((err) => console.error('oh no'));

  // you can add or remove to the list dynamically using allow and forbid
  mrRogers.allow('badword').then(...);
  mrRogers.forbid('candy').then(...);

  // you can always revert back to the original list (careful, you'll lose all previously made changes)
  mrRogers.useDefaults().then(...);

```

### Tests

In order to test all functionality you'll need postres running. Create the appropriate user and database:
```
createuser mr_rogers_test
createdb mr_rogers_test
```

Create some test environment variables
```
$ echo "APP_NAME=mr_rogers_test" >> test/test.env
$ echo "DATABASE_URL=postgres://mr_rogers_test:dbpass@localhost:5432/mr_rogers_test" >> test/test.env
```

Then run the test suite
```
npm test
```
