'use strict';
const path = require('path');
const tar = require('tar');
const zlib = require('zlib');
const fs = require('fs');

module.exports = function unzipAndExtract(fileName, callback) {
  let p = path.join(process.cwd(), fileName);
  let exx = tar.Extract({
    path: process.cwd()
  })
  .on('error', callback)
  .on('end', callback);
  let gunz = zlib.createGunzip();
  fs.createReadStream(p)
  .on('error', callback)
  .pipe(gunz)
  .pipe(exx);
}
