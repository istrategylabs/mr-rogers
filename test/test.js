
'use strict';

var test      = require( 'tape' );
var profanity = require( '../index' );
var ctx       = require( '../../kevin-johnson' );
var opts = {
  appName: 'mr_rogers_test'
};

var errorFunc = function( err ) {
  throw err;
};

test( 'clean text returns false', function ( t ) {
  var text = 'Here is some clean text #obama';
  var mrRogers;

  ctx( opts )
    .then( function ( kj ) {
      return profanity( { kevinJohnson: kj } );
      }).then( function ( m ) {
        mrRogers = m;
        return mrRogers.useDefaults();
      }).then( function() {
        return mrRogers.detect( text );
      }).then( function ( hasProfanity ) {
        t.equal( hasProfanity, false );
        t.end();
      }).catch( errorFunc );
});

test( 'dirty text returns true', function ( t ) {
  var text = 'Here is some dirty fucking text';
  var mrRogers;

  ctx( opts )
    .then( function ( kj ) {
      return profanity( { kevinJohnson: kj } );
    }).then( function ( m ) {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( function () {
      return mrRogers.detect( text );
    }).then( function ( hasProfanity ) {
      t.equal( hasProfanity, true );
      t.end();
    }).catch( errorFunc );
});

test('forbid a clean word', function ( t ) {
  var text = 'blah blah obama trump';
  var word = 'obama';
  var mrRogers;

  ctx( opts )
    .then( function ( kj ) {
      return profanity( { kevinJohnson: kj } );
    }).then( function ( ctrl ) {
      mrRogers = ctrl;
      return mrRogers.useDefaults();
    }).then( function () {
      return mrRogers.forbid( word );
    }).then( function () {
      return mrRogers.detect( text );
    }).then( function ( hasProfanity ) {
      t.equal( hasProfanity, true );
      t.end();
    });
});

test('allow a dirty word', function ( t ) {
  var text = 'blah blah obama trump';
  var word = 'obama';
  var mrRogers;

  ctx( opts )
    .then( function ( kj ) {
      return profanity( { kevinJohnson: kj } );
    }).then( function ( ctrl ) {
      mrRogers = ctrl;
      return mrRogers.useDefaults();
    }).then( function () {
      return mrRogers.allow( word );
    }).then( function () {
      return mrRogers.detect( text );
    }).then( function ( hasProfanity ) {
      t.equal( hasProfanity, false );
      t.end();
    });
});

test('cleanup', function ( t ) {
  t.end();
  process.exit();
});
