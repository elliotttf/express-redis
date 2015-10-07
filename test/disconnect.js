var expressRedis = require('../');
var redis = require('redis');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

module.exports = {
  disconnect: function (test) {
    test.expect(2);

    var conn = new EventEmitter();
    conn.quit = function () {
      conn.emit('end');
    };
    this.stub = sinon.stub(redis, 'createClient', function () {
      return conn;
    });

    var mWare = expressRedis();
    mWare.disconnect(function () {
      test.ok(true, 'Client not disconnected.');
      mWare.disconnect(function () {
        test.ok(true, 'Already disconnected did not work.');
        test.done();
      });
    });
  }
};

