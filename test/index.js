var assert = require('chai').assert;
var express = require('express');
var reverse = require('..');

describe('express-reverse', function() {
  var app;
  var noop = function(req, res, next) { next(); };

  beforeEach(function() {
    app = express();
    reverse(app);
  });

  it('should augment express app', function() {
    app.get('/test', noop);
    assert.isUndefined(app._namedRoutes);
    app.get('test', '/test', noop);
    assert.isDefined(app._namedRoutes);
    assert.isDefined(app.locals.url);
  });

  it('should generate reverse route URLs', function() {
    app.get('test 1', '/test', noop);
    app.get('test 2', '/test/:x', noop);
    app.get('test 3', '/test/:x?', noop);

    var url = app.locals.url;
    assert.equal(url('test 1'), '/test');
    assert.equal(url('test 2', { x: '1' }), '/test/1');
    assert.throws(function() { url('test 2'); }, 'Missing value for "x".');
    assert.equal(url('test 3', { x: '1' }), '/test/1');
    assert.equal(url('test 3'), '/test');
    assert.throws(function() { url('test 4'); }, 'Route not found: test 4');
  });

  it('should add res.redirectToRoute middleware', function() {
    var middelware;
    app.use = function(fn) { middleware = fn; };
    reverse(app);
    var redirectArgs;
    var res = { redirect: function() { redirectArgs = arguments } };
    middleware(null, res, function() {});

    assert.isDefined(res.redirectToRoute);

    app.get('test 1', '/test', noop);
    app.get('test 2', '/test/:x', noop);

    res.redirectToRoute('test 1');
    assert.deepEqual(redirectArgs, ['/test']);
    res.redirectToRoute(301, 'test 1');
    assert.deepEqual(redirectArgs, [301, '/test']);
    res.redirectToRoute('test 2', { x: 1 });
    assert.deepEqual(redirectArgs, ['/test/1']);
  });
});