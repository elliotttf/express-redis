var expressRedis = require('../');
var redis = require('redis');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

module.exports = {
  noOpts: function (test) {
    test.expect(3);
    this.stub = sinon.stub(redis, 'createClient', function () {
      return {connected: true};
    });

    var mWare = expressRedis();
    test.equal(typeof mWare.connect, 'function', 'Connect method not added.');
    test.equal(typeof mWare.disconnect, 'function', 'Disconnect method not added.');

    var req = {};
    mWare(req, {}, function () {
      test.notEqual(typeof req.db, 'undefined', 'Redis not added to request.');
      test.done();
    });
  },
  delayedReady: function (test) {
    test.expect(1);
    var conn = new EventEmitter();
    this.stub = sinon.stub(redis, 'createClient', function () {
      return conn;
    });

    var mWare = expressRedis();

    var req = {};
    mWare(req, {}, function () {
      test.notEqual(typeof req.db, 'undefined', 'Redis not added to request.');
      test.done();
    });

    conn.emit('ready');
  },
  customPort: function (test) {
    test.expect(1);
    var testPort = 123;

    this.stub = sinon.stub(redis, 'createClient', function (port) {
      test.equal(port, testPort, 'Custom port not used.');
      test.done();
    });

    expressRedis(testPort);
  },
  customHost: function (test) {
    test.expect(1);
    var testHost = 'example.com';

    this.stub = sinon.stub(redis, 'createClient', function (port, host) {
      test.equal(host, testHost, 'Custom host not used.');
      test.done();
    });

    expressRedis(undefined, testHost);
  },
  customOptions: function (test) {
    test.expect(1);
    var testOpts = {test:1};

    this.stub = sinon.stub(redis, 'createClient', function (port, host, options) {
      test.equal(options.test, testOpts.test, 'Custom options not used.');
      test.done();
    });

    expressRedis(undefined, undefined, testOpts);
  },
  customName: function (test) {
    test.expect(1);
    this.stub = sinon.stub(redis, 'createClient', function () {
      return {connected: true};
    });

    var mWare = expressRedis(undefined, undefined, undefined, 'redis');
    var req = {};
    mWare(req, {}, function () {
      test.notEqual(
        typeof req.redis,
        'undefined',
        'Custom redis name not added to request.'
      );
      test.done();
    });
  }
};

