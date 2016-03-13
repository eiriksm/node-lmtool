'use strict';
const url = 'http://www.speech.cs.cmu.edu/cgi-bin/tools/lmtool/run';
const async = require('async');
const uploadText = require('./src/uploadText');
const findArchive = require('./src/findArchive');
const downloadArchive = require('./src/downloadArchive');
const extractArchive = require('./src/extractArchive');
module.exports = function createDictionary(words, callback) {
  async.waterfall([
    uploadText.bind(null, url, words),
    findArchive,
    downloadArchive,
    extractArchive
  ], function(e, d) {
    callback(e);
  });
}
