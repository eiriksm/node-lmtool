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

const should = require('should');

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
    let server = require('http').createServer((req, res) => {
      res.end('testResponse')
    }).listen(port);
    require('../src/downloadArchive')(`http://localhost:${port}/1234.tar.gz`, (err, d) => {
      // See that the contents of the file is as expected.
      fs.readFileSync(path.join(process.cwd(), d)).toString().should.equal('testResponse');
      server.close();
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
  it('Should do as expected when encountering unknown file', (done) => {
    proxyquire('../src/extractArchive', {
    })('willneverxist.tar.gz', (err, d) => {
      err.code.should.equal('ENOENT');
      done()
    });
  });
});

describe('findArchive module', function() {
  // jsdom takes some time to start, some times.
  this.timeout(5000);
  it('Should export a function', () => {
    require('../src/findArchive').should.be.instanceOf(Function);
  });
  it('Should do as expected', (done) => {
    let port = 8877;
    let server = require('http').createServer((req, res) => {
      res.end('<html><body><a href="1">test</a><a href="2.tgz">test2</a></body></html>');
    }).listen(port);
    require('../src/findArchive')(`http://localhost:${port}`, (err, d) => {
      d.should.equal(`http://localhost:${port}/2.tgz`)
      done(err);
      server.close()
    });
  });
  it('Should do as expected when no archive is found', (done) => {
    let port = 8888;
    let server = require('http').createServer((req, res) => {
      res.end('<html><body><a href="1">test</a><a href="2.tar.gz">test2</a></body></html>');
    }).listen(port);
    require('../src/findArchive')(`http://localhost:${port}`, (err, d) => {
      should(d).equal(undefined);
      err.message.should.equal('No archive found.')
      server.close()
      done();
    });
  });
  it('Should do as expected when having jsdom error', (done) => {
    proxyquire('../src/findArchive', {
      'jsdom': {
        env: function(url, inject, callback) {
          callback(new Error(`No way will I inject ${inject} to ${url}`));
        }
      }
    })('http://example.com', (err, d) => {
      err.message.should.equal('No way will I inject http://code.jquery.com/jquery.js to http://example.com');
      done();
    });
  })
});

describe('uploadText module', function() {
  it('Should export a function', () => {
    require('../src/uploadText').should.be.instanceOf(Function);
  });
});
