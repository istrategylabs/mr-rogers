
'use strict';

var fs  = require( 'fs' );
var path = require( 'path' );
var P   = require( 'bluebird' );

exports.fetchDefaultWords = function() {
  var words;
  // var resolver  = P.pending();
  var wordsFile = path.join( __dirname, 'words.json' );
  var data = fs.readFileSync( wordsFile );

  try {
    words = JSON.parse( data.toString() ).words;
    return words;
  } catch( e ) {
    return;
  }

  // fs.readFile( wordsFile, function ( err, data ) {
  //   if ( err ) {
  //     resolver.reject( err );
  //   } else {
  //     try {
  //       var words = JSON.parse( data.toString() ).words;
  //       resolver.resolve( words );
  //     } catch ( e ) {
  //       resolver.reject( e );
  //     }
  //   }
  // });
  // return resolver.promise;
};
