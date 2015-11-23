
'use strict';

const test      = require( 'tape' );
const profanity = require( '../index' );
const ctx       = require( 'kevin-johnson' );
const opts = {
  appName: 'mr_rogers_test'
};

const errorFunc = ( err ) => {
  throw err;
};

test( 'clean text returns false', ( t ) => {
  const text = 'Here is some clean text #obama';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( m ) => {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, false );
      t.end();
    }).catch( errorFunc );
});

test( 'dirty text returns true', ( t ) => {
  const text = 'Here is some dirty fucking text';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( m ) => {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, true );
      t.end();
    }).catch( errorFunc );
});

test('forbid a clean word', ( t ) => {
  const text = 'blah blah obama trump';
  const word = 'obama';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( ctrl ) => {
      mrRogers = ctrl;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.forbid( [ word ] );
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, true );
      t.end();
    });
});

test('allow a dirty word', ( t ) => {
  const text = 'blah blah obama trump';
  const word = 'obama';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( ctrl ) => {
      mrRogers = ctrl;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.allow( word );
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, false );
      t.end();
    });
});

test('do not detect pattern within words', ( t ) => {
  const text = 'Here is some dirtyfuckingtext';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( m ) => {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, false );
      t.end();
    }).catch( errorFunc );
});

test('detect pattern at the beginning of a string', ( t ) => {
  const text = 'ass Here is some';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( m ) => {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, true );
      t.end();
    }).catch( errorFunc );
});

test('detect pattern at the end of a string', ( t ) => {
  const text = 'Here is the word shit.';
  let   mrRogers;

  ctx( opts )
    .then( ( kj ) => {
      return profanity( { kevinJohnson: kj } );
    }).then( ( m ) => {
      mrRogers = m;
      return mrRogers.useDefaults();
    }).then( () => {
      return mrRogers.detect( text );
    }).then( ( hasProfanity ) => {
      t.equal( hasProfanity, true );
      t.end();
    }).catch( errorFunc );
});

test('cleanup', ( t ) => {
  t.end();
  process.exit();
});
