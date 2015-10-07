/**
 * Express - Redis
 * Copyright(c) 2014 Elliott Foster <elliottf@codebrews.com>
 * MIT Licensed.
 */

var redis = require('redis');
var debug = require('debug')('express:redis');

var client;

module.exports = function (port, host, options, name) {
  port = port || 6379;
  host = host || '127.0.0.1';
  options = options || {};
  name = name || 'db';

  client = redis.createClient(port, host, options);

  var f = function (req, res, next) {
    if (client.connected) {
      req[name] = client;
      next();
    }
    else {
      client.on('ready', function () {
        debug('Redis connection ready.');
        req[name] = client;
        next();
      });
    }
  };

  // Expose the client in the return object.
  f.client = client;

  f.connect = function (next) {
    if (client && client.connected) {
      client.once('end', function () {
        client = redis.createClient(port, host, options, name);
        next();
      });
      client.quit();
    }
    else {
      client = redis.createClient(port, host, options, name);
      next();
    }
  };

  f.disconnect = function (next) {
    if (client) {
      client.once('end', function () {
        client = null;
        next();
      });
      client.quit();
    }
    else {
      next();
    }
  };

  return f;
};

