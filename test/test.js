'use strict';
require('should');

describe('downloadArchive module', function() {
  it('Should export a function', () => {
    require('../src/downloadArchive').should.be.instanceOf(Function);
  });
});

describe('extractArchive module', function() {
  it('Should export a function', () => {
    require('../src/extractArchive').should.be.instanceOf(Function);
  });
});

describe('findArchive module', function() {
  it('Should export a function', () => {
    require('../src/findArchive').should.be.instanceOf(Function);
  });
});

describe('uploadText module', function() {
  it('Should export a function', () => {
    require('../src/uploadText').should.be.instanceOf(Function);
  });
});
