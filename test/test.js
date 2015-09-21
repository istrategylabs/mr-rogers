
'use strict';

var test = require( 'tape' );
var profanity = require( '../index' );

test( 'clean text returns false', function ( t ) {
  var text = 'Here is some clean text #obama';
  var profCtrl = profanity();
  t.plan( 1 );
  profCtrl.detect( text )
    .then( function ( hasProfanity ) {
      t.equal( hasProfanity, false );
    });
});

test( 'clean text returns false', function ( t ) {
  var text = 'Here is some dirty fucking text';
  var profCtrl = profanity();
  t.plan( 1 );
  profCtrl.detect( text )
    .then( function ( hasProfanity ) {
      t.equal( hasProfanity, true );
    });
});
