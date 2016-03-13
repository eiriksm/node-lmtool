'use strict';
const request = require('request');
module.exports = function uploadText(url, words, callback) {
  let req = request.post({
    url: url,
    forever: true,
    headers: {
      referer: 'http://www.speech.cs.cmu.edu/tools/lmtool-new.html',
      'user-agent': 'node-lmtool (https://github.com/eiriksm/node-lmtool)'
    }
  }, function(e, r) {
    if (e) {
      callback(e);
    }
    else {
      // Check if we found a header.
      if (r && r.headers && r.headers.location) {
        callback(null, r.headers.location);
      }
      else {
        callback(new Error('No location header found'));
      }
    }
  });
  let form = req.form();
  form.append('formtype', 'simple');
  form.append('corpus', words.join("\n"), {
    filename: 'corpus.txt',
    contentType: 'text/plain'
  });
}
