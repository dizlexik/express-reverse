var methods = require('methods');

module.exports = function(app, options) {
  if (!options) options = {};
  if (!options.helperName) options.helperName = 'url';
  augmentVerbs(app);
  addHelper(app, options);
};

function augmentVerbs(app) {
  methods.forEach(function(method) {
    var _fn = app[method];
    app[method] = function(path, name) {
      if ((method == 'get' && arguments.length == 1) ||
        (typeof(name) != 'string' && !(name instanceof String)))
        return _fn.apply(this, arguments);

      var args = Array.prototype.slice.call(arguments, 0);
      args.splice(1, 1);
      var ret = _fn.apply(this, args);

      if (!app._namedRoutes) app._namedRoutes = {};
      var routes = this.routes[method];
      app._namedRoutes[name] = routes[routes.length - 1];

      return ret;
    };
  });
}

function addHelper(app, options) {
  app.locals[options.helperName] = function(name, params) {
    return reverse(app._namedRoutes[name].path, params);
  };
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