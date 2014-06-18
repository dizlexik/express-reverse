var methods = require('methods');

module.exports = function(app, options) {
  if (!options) options = {};
  if (!options.helperName) options.helperName = 'url';
  augmentVerbs(app);
  addHelper(app, options);
  addMiddleware(app, options);
};

function augmentVerbs(app) {
  methods.forEach(function(method) {
    var _fn = app[method];
    app[method] = function(name, path) {
      if ((method == 'get' && arguments.length == 1) ||
        (typeof(path) != 'string' && !(path instanceof String)))
        return _fn.apply(this, arguments);

      var args = Array.prototype.slice.call(arguments, 0);
      args.shift();
      var ret = _fn.apply(this, args);

      if (!app._namedRoutes) app._namedRoutes = {};
      app._namedRoutes[name] = this.route(args[0]);

      return ret;
    };
  });
}

function addHelper(app, options) {
  app.locals[options.helperName] = function(name, params) {
    var route = app._namedRoutes[name];
    if (!route) throw new Error('Route not found: ' + name);
    return reverse(app._namedRoutes[name].path, params);
  };
}

function addMiddleware(app, options) {
  app.use(function(req, res, next) {
    res.redirectToRoute = function(status, routeName, params) {
      if (isNaN(status)) {
        params = routeName;
        routeName = status;
      }
      var url = reverse(app._namedRoutes[routeName].path, params);
      if (isNaN(status)) return res.redirect(url);
      else return res.redirect(status, url);
    };
    next();
  });
}

function reverse(path, params) {
  if (!params) params = {};
  return path.replace(/(\/:\w+\??)/g, function (m, p1) {
    var required = !~p1.indexOf('?');
    var param = p1.replace(/[/:?]/g, '');
    if (required && !params.hasOwnProperty(param))
      throw new Error('Missing value for "' + param + '".');
    return params[param] ? '/' + params[param] : '';
  });
}