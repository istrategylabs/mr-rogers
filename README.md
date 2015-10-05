
# Mr Rogers

A small utility for screening out bad words. The base list is the same as a list
used by Google (for certain things) and was published by another dev

http://fffff.at/googles-official-list-of-bad-words/

### Quick Start
```javascript
  // mr rogers uses a posgtres backed store
  var var profanity = require( 'mr-rogers' );
  var kevinJohnson = require( 'kevin-johnson' );
  var clean = 'some clean text';
  var dirty = 'some dirty ass text';
  var mrRogers;

  kevinJohnson()
    .then( function ( kj ) {
        return profanity( { kevinJohnson: kj } );
    }).then( function ( m ) {
        mrRogers = m;
        return mrRogers.detect( clean );
    }).then( function ( hasProfanity ) {
        console.log(hasProfanity); // false
        return mrRogers.detect( dirty );
    }).then( function ( hasProfanity ) {
        console.log(hasProfanity); // true
    });

  // you can add or remove to the list dynamically using allow and forbid
  mrRogers.allow( 'badword' ).then( ... );

  mrRogers.forbid( 'candy' ).then( ... );

  // you can always revert back to the original list (careful, you'll lose all previously made changes)
  mrRogers.useDefaults().then( ... );

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
