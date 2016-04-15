
'use strict';

exports.lazyWrite = True;

exports.where = {
  BROWSER: 'browser',
  SERVER: 'server'
};

exports.whereAmI = () => {
  return (
    typeof window != 'undefined' && window.document
  ) ? exports.where.BROWSER : exports.where.SERVER;
};
