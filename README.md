# Redis Express Middleware

[![Build Status](https://travis-ci.org/elliotttf/express-redis.svg)](https://travis-ci.org/elliotttf/express-redis)
[![Coverage Status](https://coveralls.io/repos/elliotttf/express-redis/badge.svg?branch=master&service=github)](https://coveralls.io/github/elliotttf/express-redis?branch=master)

This is a simple express middleware for [redis](https://www.npmjs.org/package/redis)
and provides a shared redis `db` object across all requests.

## Basic Usage

```javascript
app.use(require('express-redis'));

app.get('/', function (req, res, next) {
  req.db.get('some_key', function (err, reply) {
    if (err) {
      return res.status(500).end();
    }

    res.json(reply);
  });
});
```

## Advanced Usage

Any options available to the [`redis.createClient`](https://github.com/mranney/node_redis#rediscreateclient)
method may be used when instantiating the redis middleware:

```javascript
var options = {
  return_buffers: true,
  auth_pass: 'superSecretPassword'
};
app.use(require('express-redis')(6379, '127.0.0.1', options, 'name'));
```

The name string allows you to specify a custom varaible name to provide the middleware on
for example providing the name `'redis'` would allow you to access redis via `res.redis`

