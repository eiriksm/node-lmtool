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
      fs.unlinkSync(path.join(process.cwd(), d));
      server.close();
      done(err);
    });
  });
  it('Should call the callback only once, even if we force it to do something stupid', (done) => {
    stub = new StubEmitter();
    proxyquire('./../src/downloadArchive', {
      'request': requestStub
    })('http://localhost:8866/1234.tar.gz', (err, d) => {
      fs.unlinkSync(path.join(process.cwd(), d));
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
  it('Should return the filename when the file exists', (done) => {
    // Create an empty, valid tar gz archive.
    let fileName = 'TAR1337.tgz';
    fs.writeFileSync(fileName, new Buffer([31, 139, 8, 0, 189, 204, 242, 86, 0, 3, 237, 207, 75, 10, 133, 48, 12, 133, 225, 46, 165, 75, 136, 53, 141, 235, 41, 168, 32, 190, 160, 234, 254, 175, 222, 135, 163, 139, 51, 29, 253, 223, 228, 16, 56, 132, 36, 185, 251, 137, 136, 169, 250, 35, 43, 139, 239, 148, 240, 153, 127, 124, 17, 172, 210, 168, 22, 204, 188, 20, 165, 68, 117, 94, 30, 184, 205, 109, 203, 154, 242, 126, 74, 211, 229, 174, 31, 231, 60, 164, 169, 254, 215, 219, 107, 109, 123, 177, 231, 251, 199, 153, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 220, 232, 5, 194, 100, 156, 77, 0, 40, 0, 0]));
    require('../src/extractArchive')(fileName, (err, d) => {
      fs.unlinkSync(fileName);
      d.should.equal('1337');
      done(err);
    })
  })
  it('Should do as expected when encountering unknown file', (done) => {
    require('../src/extractArchive')('willneverxist.tar.gz', (err, d) => {
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
  it('Should do as expected when response is as expected', (done) => {
    let port = 8899;
    let server = require('http').createServer((req, res) => {
      res.writeHead(302, {Location: 'http://example.com'});
      res.end();
    }).listen(port);
    require('../src/uploadText')(`http://localhost:${port}`, ['a', 'b'], (err, d) => {
      d.should.equal('http://example.com');
      done(err);
      server.close();
    });
  });
  it('Should do as expected when response is wrong', (done) => {
    let port = 9911;
    let server = require('http').createServer((req, res) => {
      res.end('hello');
    }).listen(port);
    require('../src/uploadText')(`http://localhost:${port}`, ['a', 'b'], (err, d) => {
      err.message.should.equal('No location header found');
      server.close();
      done();
    });
  });
  it('Should do as expected if request returns an error', (done) => {
    require('../src/uploadText')('noprotocol://horrible&domain:thisisnotaport', ['a', 'b'], (err, d) => {
      err.message.should.equal('Invalid protocol: noprotocol:');
      done();
    });
  })
});
