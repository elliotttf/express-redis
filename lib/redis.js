'use strict';

/**
 * Express - Redis
 * Copyright(c) 2014 Elliott Foster <elliottf@codebrews.com>
 * MIT Licensed.
 */

const redis = require('redis');
const debug = require('debug')('express:redis');

let client;

module.exports = (port = 6379, host = '127.0.0.1', options = {}, name = 'db') => {
  client = redis.createClient(port, host, options);

  const f = (req, res, next) => {
    if (client.connected) {
      req[name] = client; // eslint-disable-line no-param-reassign
      next();
    }
    else {
      client.on('ready', () => {
        debug('Redis connection ready.');
        req[name] = client; // eslint-disable-line no-param-reassign
        next();
      });
    }
  };

  // Expose the client in the return object.
  f.client = client;

  f.connect = (next) => {
    if (client && client.connected) {
      client.once('end', () => {
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

  f.disconnect = (next) => {
    if (client) {
      client.once('end', () => {
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

