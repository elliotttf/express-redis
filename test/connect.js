'use strict';

const expressRedis = require('../');
const redis = require('redis');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;

module.exports = {
  connect(test) {
    test.expect(1);

    const conn = { connected: true };
    this.stub = sinon.stub(redis, 'createClient').callsFake(() => conn);

    const mWare = expressRedis();
    conn.connected = false;
    mWare.connect(() => {
      test.ok(true, 'Middleware did not connect.');
      test.done();
    });
  },
  reconnect(test) {
    test.expect(2);
    const conn = new EventEmitter();
    conn.quit = () => {
      test.ok(true, 'Middleware did not disconnect.');
      conn.emit('end');
    };
    conn.connected = true;

    this.stub = sinon.stub(redis, 'createClient').callsFake(() => conn);

    const mWare = expressRedis();

    mWare.connect(() => {
      test.ok(true, 'Middleware did not reconnect.');
      test.done();
    });
  },
};
