'use strict';
const jsdom = require('jsdom');
module.exports = function(url, callback) {
  jsdom.env(
    url,
    ['http://code.jquery.com/jquery.js'],
    function (err, window) {
      if (err) {
        return callback(err);
      }
      // Get the last link on the page.
      let link = window.$('a').last()[0].href;
      // Check that it is tgz.
      if (!link.indexOf('tgz')) {
        callback(new Error('No archive found.'));
      }
      else {
        callback(null, link);
      }
    }
  );
};
