'use strict';
const async = require('async');

const uploadText = require('./src/uploadText');
const findArchive = require('./src/findArchive');
const downloadArchive = require('./src/downloadArchive');
const extractArchive = require('./src/extractArchive');

const url = 'http://www.speech.cs.cmu.edu/cgi-bin/tools/lmtool/run';

module.exports = function createDictionary(words, callback) {
  async.waterfall([
    uploadText.bind(null, url, words),
    findArchive,
    downloadArchive,
    extractArchive
  ], callback);
};
