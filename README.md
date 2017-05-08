# node-lmtool

[![Greenkeeper badge](https://badges.greenkeeper.io/eiriksm/node-lmtool.svg)](https://greenkeeper.io/)
Programatically submit files to lmtool and get the files back

[![Build Status](https://travis-ci.org/eiriksm/node-lmtool.svg?branch=master)](https://travis-ci.org/eiriksm/node-lmtool)
[![Coverage Status](https://coveralls.io/repos/eiriksm/node-lmtool/badge.svg?branch=master)](https://coveralls.io/r/eiriksm/node-lmtool?branch=master)
[![Code Climate](https://codeclimate.com/github/eiriksm/node-lmtool/badges/gpa.svg)](https://codeclimate.com/github/eiriksm/node-lmtool)
[![Dependency Status](https://david-dm.org/eiriksm/node-lmtool.svg)](https://david-dm.org/eiriksm/node-lmtool)

## What does it do?

It submits a corpus file for you, to the service [lmtool](http://www.speech.cs.cmu.edu/tools/lmtool-new.html). This service will give you a dictionary and vocabulary back, to be used for speech to text tools.

## Installation

`npm i -S lmtool`

## API

### lmtool(words, callback)

Start a new lmtool submission with the words specified.

#### Arguments

- `words`. Required. An array of words to use for your corpus file.
- `callback(err, fileName)`. Required. A callback to call with the name prefix of your dictionary and vocabulary files.

An array of words you want to use.

## Example

```js
const lmtool = require('lmtool');

lmtool(['lazer', 'exterminate', 'cuddle'], (err, fileName) => {
  // fileName will now be something like 1337, and that will represent the
  // prefix for the extracted files you have gotten downloaded. Or, of course,
  // if there was an error, fileName will be empty and err will contain the
  // information about the error.
  console.log(require('fs').readFileSync('1337.dic').toString());
  // Will output something like:
  // CUDDLE	K AH D AH L
  // EXTERMINATE	IH K S T ER M AH N EY T
  // LAZER	L EY Z ER

});
```
