'use strict';
const proxyquire = require('proxyquire').noPreserveCache();;
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function StubEmitter() {
  EventEmitter.call(this);
}
util.inherits(StubEmitter, EventEmitter);
StubEmitter.prototype.pipe = function () {
  // noop.
};

require('should');

let stub;
let requestStub = {
  get: () => {
    return stub
  }
}

describe('downloadArchive module', function() {
  it('Should export a function', () => {
    require('../src/downloadArchive').should.be.instanceOf(Function);
  });
  it('Should do as expected', (done) => {
    let port = 8866;
    require('http').createServer((req, res) => {
      res.end('testResponse')
    }).listen(port);
    require('../src/downloadArchive')(`http://localhost:${port}/1234.tar.gz`, (err, d) => {
      // See that the contents of the file is as expected.
      fs.readFileSync(path.join(process.cwd(), d)).toString().should.equal('testResponse');
      done(err);
    });
  });
  it('Should call the callback only once, even if we force it to do something stupid', (done) => {
    stub = new StubEmitter();
    proxyquire('./../src/downloadArchive', {
      'request': requestStub
    })('http://localhost:8866/1234.tar.gz', (err, d) => {
      done(err);
    });
    setTimeout(_ => {
      stub.emit('end');
      stub.emit('error', new Error('problem'));
    }, 100);
  });
});

describe('extractArchive module', function() {
  it('Should export a function', () => {
    require('../src/extractArchive').should.be.instanceOf(Function);
  });
});

describe('findArchive module', function() {
  // jsdom takes some time to start, some times.
  this.timeout(5000);
  it('Should export a function', () => {
    require('../src/findArchive').should.be.instanceOf(Function);
  });
});

describe('uploadText module', function() {
  it('Should export a function', () => {
    require('../src/uploadText').should.be.instanceOf(Function);
  });
});
