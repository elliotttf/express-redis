/**
 * Express - Redis
 * Copyright(c) 2014 Elliott Foster <elliottf@codebrews.com>
 * MIT Licensed.
 */

var redis = require('redis');
var debug = require('debug')('express:redis');

module.exports = function (port, host, options) {
  port = port || 6379;
  host = host || '127.0.0.1';
  options = options || {};

  var client = redis.createClient(port, host, options);

  var f = function (req, res, next) {
    client.on('ready', function () {
      debug('Redis connection ready.');
      req.db = client;
      next();
    });
  };

  return f;
};

