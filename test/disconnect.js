'use strict';

const expressRedis = require('../');
const redis = require('redis');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;

module.exports = {
  disconnect(test) {
    test.expect(2);

    const conn = new EventEmitter();
    conn.quit = () => conn.emit('end');
    this.stub = sinon.stub(redis, 'createClient', () => conn);

    const mWare = expressRedis();
    mWare.disconnect(() => {
      test.ok(true, 'Client not disconnected.');
      mWare.disconnect(() => {
        test.ok(true, 'Already disconnected did not work.');
        test.done();
      });
    });
  },
};

