'use strict';

const init = require('./init');
const connect = require('./connect');
const disconnect = require('./disconnect');

module.exports = {
  tearDown(cb) {
    if (this.stub) {
      this.stub.restore();
    }
    cb();
  },
  init,
  connect,
  disconnect,
};

