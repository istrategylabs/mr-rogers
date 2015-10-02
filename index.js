
'use strict';

var P     = require( 'bluebird' );
var async = require( 'async' );
var S     = require( 'string' );
var check = require( 'check-types' );
var utils;

module.exports = function( opts ) {
  opts = opts || {};
  var _initResolver = P.pending();
  var _badWords = opts.badWords;
  var kj        = opts.kevinJohnson;
  var key       = opts.key = 'mr_rogers_banned';

  utils = require( './lib/utils' )( kj, key );

  var _api = {
    detect: function( text ) {
      var resolver = P.pending();
      var searchable = S( text.toLowerCase() );

      async.detect( _badWords, detectWord, function ( result ) {
        if ( result ) {
          resolver.resolve( true );
        } else {
          resolver.resolve( false );
        }
      });

      function detectWord( word, callback ) {
        var contains = searchable.contains( word.toLowerCase() );
        if ( contains === true ) {
          console.log( 'Contains \'%s\'', word );
        }
        return callback( contains );
      }
      return resolver.promise;
    },

    allow: function( words ) {
      words         = ( check.array( words ) ) ? words : [ words ];
      var resolver  = P.pending();
      var index;
      var i;

      for ( i = 0; i < words.length; i++ ) {
        index = _badWords.indexOf( words[ i ] );
        if ( index > -1 ) {
          _badWords.splice( index, 1 );
        }
      }

      utils.persistWords( _badWords )
        .then( function() {
          resolver.resolve();
        }).catch( function ( err ) {
          resolver.reject( err );
        });

      return resolver.promise;
    },

    forbid: function( words ) {
      words    = ( check.array( words ) ) ? words : [ words ];
      var resolver = P.pending();
      var index;
      var i;

      for ( i = 0; i < words.length; i++ ) {
        index = _badWords.indexOf( words[ i ] );
        if ( index === -1 ) {
          _badWords.push( words[ i ] );
        }
      }

      utils.persistWords( _badWords )
        .then( function() {
          resolver.resolve();
        }).catch( function ( err ) {
          resolver.reject( err );
        });

      return resolver.promise;
    },

    useDefaults: function() {
      var resolver = P.pending();
      var defaults = utils.fetchDefaultWords();
      _badWords = defaults;
      utils.persistWords( _badWords )
        .then( function () {
          resolver.resolve();
        }).catch( function ( err ) {
          resolver.reject( err );
        });
      return resolver.promise;
    },
  };

  utils.fetchStoredWords()
    .then( function ( badWords ) {
      if ( badWords ) {
        _badWords = badWords;
        _initResolver.resolve( _api );
      } else {
        _badWords = utils.fetchDefaultWords();
        utils.persistWords( _badWords )
          .then( function () {
            _initResolver.resolve( _api );
          }).catch( function ( err ) {
            _initResolver.reject( err );
          });
      }
    }).catch( function ( err ) {
      _initResolver.reject( err );
    });

  return _initResolver.promise;
};
