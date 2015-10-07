module.exports = {
  tearDown: function (cb) {
    if (this.stub) {
      this.stub.restore();
    }
    cb();
  },
  init: require('./init'),
  connect: require('./connect'),
  disconnect: require('./disconnect')
};

