'use strict'

var redis = require('redis');

module.exports = function (port, host, options) {
  port = port || 6379;
  host = host || '127.0.0.1';
  options = options || {};

  var client = redis.createClient(port, host, options);

  var f = function (req, res, next) {
    client.on('connect', function () {
      req.db = client;
      next();
    });
  };

  return f;
};

