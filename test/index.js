var assert = require('chai').assert;

describe('express-reverse', function() {
  var app;
  var noop = function(req, res, next) { next(); };

  beforeEach(function() {
    var express = require('express');
    var reverse = require('..');
    app = express();
    reverse(app);
  });

  it('should not augment express app if no named routes exist', function() {
    app.get('/test', noop);
    assert.isUndefined(app._namedRoutes);
  });

  it('should augment express app when named routes exist', function() {
    app.get('/test', 'test', noop);
    assert.isDefined(app._namedRoutes);
    assert.isDefined(app.locals.url);
  });

  it('should generate reverse route URLs', function() {
    app.get('/test', 'test 1', noop);
    app.get('/test/:x', 'test 2', noop);
    app.get('/test/:x?', 'test 3', noop);

    var url = app.locals.url;
    assert.equal(url('test 1'), '/test');
    assert.equal(url('test 2', { x: '1' }), '/test/1');
    assert.throws(function() { url('test 2'); }, 'Missing value for "x".');
    assert.equal(url('test 3', { x: '1' }), '/test/1');
    assert.equal(url('test 3'), '/test');
  });
});