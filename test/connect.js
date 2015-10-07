var expressRedis = require('../');
var redis = require('redis');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

module.exports = {
  connect: function (test) {
    test.expect(1);

    var conn = {connected: true};
    this.stub = sinon.stub(redis, 'createClient', function () {
      return conn;
    });

    var mWare = expressRedis();
    conn.connected = false;
    mWare.connect(function () {
      test.ok(true, 'Middleware did not connect.');
      test.done();
    });
  },
  reconnect: function (test) {
    test.expect(2);
    var conn = new EventEmitter();
    conn.quit = function () {
      test.ok(true, 'Middleware did not disconnect.');
      conn.emit('end');
    };
    conn.connected = true;

    this.stub = sinon.stub(redis, 'createClient', function () {
      return conn;
    });

    var mWare = expressRedis();

    mWare.connect(function () {
      test.ok(true, 'Middleware did not reconnect.');
      test.done();
    });
  }
};

