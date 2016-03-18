'use strict';
const request = require('request');
const fs = require('fs');
const url = require('url');
const path = require('path');

module.exports = function(uri, callback) {
  let urlObj = url.parse(uri);
  let filename = path.basename(urlObj.pathname);
  let done = false;
  let innerCallback = function() {
    if (done) {
      return;
    }
    done = true;
    callback.apply(callback, arguments);
  };
  request
  .get(uri)
  .on('error', innerCallback)
  .on('end', function() {
    innerCallback(null, filename);
  })
  .pipe(fs.createWriteStream(path.join(process.cwd(), filename)));
};
