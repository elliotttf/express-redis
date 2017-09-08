'use strict';

const expressRedis = require('../');
const redis = require('redis');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;

module.exports = {
  noOpts(test) {
    test.expect(3);
    this.stub = sinon.stub(redis, 'createClient').callsFake(() => ({ connected: true }));

    const mWare = expressRedis();
    test.equal(typeof mWare.connect, 'function', 'Connect method not added.');
    test.equal(typeof mWare.disconnect, 'function', 'Disconnect method not added.');

    const req = {};
    mWare(req, {}, () => {
      test.notEqual(typeof req.db, 'undefined', 'Redis not added to request.');
      test.done();
    });
  },
  delayedReady(test) {
    test.expect(1);
    const conn = new EventEmitter();
    this.stub = sinon.stub(redis, 'createClient').callsFake(() => conn);

    const mWare = expressRedis();

    const req = {};
    mWare(req, {}, () => {
      test.notEqual(typeof req.db, 'undefined', 'Redis not added to request.');
      test.done();
    });

    conn.emit('ready');
  },
  customPort(test) {
    test.expect(1);
    const testPort = 123;

    this.stub = sinon.stub(redis, 'createClient').callsFake((port) => {
      test.equal(port, testPort, 'Custom port not used.');
      test.done();
    });

    expressRedis(testPort);
  },
  customHost(test) {
    test.expect(1);
    const testHost = 'example.com';

    this.stub = sinon.stub(redis, 'createClient').callsFake((port, host) => {
      test.equal(host, testHost, 'Custom host not used.');
      test.done();
    });

    expressRedis(undefined, testHost);
  },
  customOptions(test) {
    test.expect(1);
    const testOpts = { test: 1 };

    this.stub = sinon.stub(redis, 'createClient').callsFake((port, host, options) => {
      test.equal(options.test, testOpts.test, 'Custom options not used.');
      test.done();
    });

    expressRedis(undefined, undefined, testOpts);
  },
  customName(test) {
    test.expect(1);
    this.stub = sinon.stub(redis, 'createClient').callsFake(() => ({ connected: true }));

    const mWare = expressRedis(undefined, undefined, undefined, 'redis');
    const req = {};
    mWare(req, {}, () => {
      test.notEqual(typeof req.redis, 'undefined', 'Custom redis name not added to request.');
      test.done();
    });
  },
};
