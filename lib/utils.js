
'use strict';

const fs        = require( 'fs' );
const path      = require( 'path' );
const P         = require( 'bluebird' );
const wordsFile = path.join( __dirname, 'words.json' );

module.exports = ( kj, key ) => {

  const helpers = {

    fetchDefaultWords() {
      let   words;
      const data = fs.readFileSync( wordsFile );

      try {
        words = JSON.parse( data.toString() ).words;
        return words;
      } catch( e ) {
        return;
      }
    },

    fetchStoredWords() {
      const resolver = P.pending();
      if ( kj ) {
        return kj.get( key );
      } else {
        fs.readFile( wordsFile, ( err, data ) => {
          if ( err ) {
            resolver.reject( err );
          } else {
            resolver.resolve( JSON.parse( data.toString() ) );
          }
        });
        return resolver.promise;
      }
    },

    persistWords( badWords ) {
      let resolver;
      let obj = {};

      if ( kj ) {
        return kj.set( key, badWords );
      } else {
        resolver = P.pending();
        obj.words = JSON.stringify( badWords, false, 4 );
        fs.writeFile( wordsFile, obj, ( err ) => {
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
