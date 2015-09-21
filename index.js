
'use strict';

var P     = require( 'bluebird' );
var async = require( 'async' );
var S     = require( 'string' );
var utils = require( './lib/utils' );

module.exports = function( badWords ) {

  var _badWords = badWords;

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
        return callback( contains );
      }

      return resolver.promise;
    }
  };

  if ( !_badWords ) {
    _badWords = utils.fetchDefaultWords();
  }

  return _api;
};
