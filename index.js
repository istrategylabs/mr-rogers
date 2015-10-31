
'use strict';

const P     = require( 'bluebird' );
const async = require( 'async' );
const S     = require( 'string' );
const check = require( 'check-types' );
let utils;

module.exports = ( opts ) => {
  opts = opts || {};
  const _initResolver = P.pending();
  let   _badWords     = opts.badWords;
  const kj            = opts.kevinJohnson;
  const key           = opts.key = 'mr_rogers_banned';

  utils = require( './lib/utils' )( kj, key );

  const _api = {
    detect( text ) {
      const resolver    = P.pending();
      const searchable  = S( text.toLowerCase() );

      async.detect( _badWords, detectWord, ( result ) => {
        if ( result ) {
          resolver.resolve( true );
        } else {
          resolver.resolve( false );
        }
      });

      function detectWord( word, callback ) {
        var contains = searchable.contains( word.toLowerCase() );
        if ( contains === true ) {
          console.log( `Contains ${word}` );
        }
        return callback( contains );
      }
      return resolver.promise;
    },

    allow( words ) {
      words         = ( check.array( words ) ) ? words : [ words ];
      const resolver  = P.pending();
      let   index;

      for ( let i = 0; i < words.length; i++ ) {
        index = _badWords.indexOf( words[ i ] );
        if ( index > -1 ) {
          _badWords.splice( index, 1 );
        }
      }

      utils.persistWords( _badWords )
        .then( () => resolver.resolve() )
        .catch( ( err ) => resolver.reject( err ) );

      return resolver.promise;
    },

    forbid: function( words ) {
      words           = ( check.array( words ) ) ? words : [ words ];
      const resolver  = P.pending();

      for ( let i = 0; i < words.length; i++ ) {
        let index = _badWords.indexOf( words[ i ] );
        if ( index === -1 ) {
          _badWords.push( words[ i ] );
        }
      }

      utils.persistWords( _badWords )
        .then( () => {
          resolver.resolve();
        }).catch( ( err ) => {
          resolver.reject( err );
        });

      return resolver.promise;
    },

    useDefaults() {
      const resolver = P.pending();
      const defaults = utils.fetchDefaultWords();

      _badWords = defaults;

      utils.persistWords( _badWords )
        .then( () => {
          resolver.resolve();
        }).catch( ( err ) => {
          resolver.reject( err );
        });

      return resolver.promise;
    },

    fetchForbidden() {
      return _badWords;
    }
  };

  utils.fetchStoredWords()
    .then( ( badWords ) => {
      if ( badWords ) {
        _badWords = badWords;
        _initResolver.resolve( Object.create( _api ) );
      } else {
        _badWords = utils.fetchDefaultWords();
        utils.persistWords( _badWords )
          .then( () => {
            _initResolver.resolve( Object.create( _api ) );
          }).catch( ( err ) => {
            _initResolver.reject( err );
          });
      }
    }).catch( ( err ) => _initResolver.reject( err ) );

  return _initResolver.promise;
};
