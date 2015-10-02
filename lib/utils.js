
'use strict';

var fs  = require( 'fs' );
var path = require( 'path' );
var P   = require( 'bluebird' );
var wordsFile = path.join( __dirname, 'words.json' );

module.exports = function( kj, key ) {

  var helpers = {
    fetchDefaultWords: function() {
      var words;
      var data = fs.readFileSync( wordsFile );

      try {
        words = JSON.parse( data.toString() ).words;
        return words;
      } catch( e ) {
        return;
      }
    },

    fetchStoredWords: function() {
      var resolver;
      if ( kj ) {
        return kj.get( key );
      } else {
        resolver = P.pending();
        fs.readFile( wordsFile, function ( err, data ) {
          if ( err ) {
            resolver.reject( err );
          } else {
            resolver.resolve( JSON.parse( data.toString() ) );
          }
        });
        return resolver.promise;
      }
    },

    persistWords: function( badWords ) {
      var resolver;
      var obj = {};
      if ( kj ) {
        return kj.set( key, badWords );
      } else {
        resolver = P.pending();
        obj.words = JSON.stringify( badWords, false, 4 );
        fs.writeFile( wordsFile, obj, function( err ) {
          if ( err ) {
            resolver.reject( err );
          } else {
            resolver.resolve();
          }
        });
        return resolver.promise;
      }
    }
  };

  return helpers;

};
