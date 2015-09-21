
'use strict';

var test = require( 'tape' );
var profanity = require( '../index' );

test( 'clean text returns false', function ( t ) {
  var text = 'Here is some clean text #obama';
  profanity()
    .then( function ( profCtrl ) {
      profCtrl.detect( text )
        .then( function ( hasProfanity ) {
          console.log( 'hasProfanity', hasProfanity );
          t.end();
        });
    });
});

test( 'dirty text returns true', function ( t ) {
  var text = 'FUCK Here is some dirty text';
  profanity()
    .then( function ( profCtrl ) {
      profCtrl.detect( text )
        .then( function ( hasProfanity ) {
          console.log( 'hasProfanity', hasProfanity );
          t.end();
        });
    });
});
