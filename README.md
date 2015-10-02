
# Mr Rogers

A small utility for screening out bad words. The base list is the same as a list
used by Google (for certain things) and was published by another dev

http://fffff.at/googles-official-list-of-bad-words/

### Quick Start
```javascript
  // mr rogers uses a posgtres backed store
  var kevinJohnson = require( 'kevin-johnson' );


```

Tests

In order to test all functionality you'll need postres running. Create the appropriate user and database:

```
createuser mr_rogers_test
createdb mr_rogers_test
```

Then run the test suite
```
npm test
```
