# Express Reverse Routing Helper

[![NPM version](https://img.shields.io/npm/v/express-reverse.svg)](https://www.npmjs.org/package/express-reverse)

## Install

```sh
npm install express-reverse
```

## Example

```js
var app = require('express')();
require('express-reverse')(app);

app.get('test', '/hello/:x', function(req, res, next) {
  res.end('hello ' + req.params.x);
});

app.get('/test-redirect', function(req, res, next) {
  res.redirectToRoute('test', { x: 'world' });
});
```

Jade:
```jade
a(href=url('test', { x: 'world' })) Test
```

EJS:
```html
<a href="<%= url('test', { x: 'world' }) %>">Test</a>
```

## Methods

### _module_(app, [options])

* `app` Express app
* `options (optional)` Defaults: `{ helperName: 'url' }`

Augments the default Express [routing methods](http://expressjs.com/api.html#app.VERB) `app.VERB(path, [callback...], callback)` to accept an optional `routeName` parameter `app.VERB([routeName], path, [callback...], callback)`.

## Helpers

### url(routeName, [parameters])

* `routeName` The route name specified when defining a route with `app.VERB(...)`.
* `parameters (optional)` An object defining the URL replacement values. For example `{ x: 123 }` will replace `:x` with `123` in the route `'/test/:x'`. Also note that replacement values are required for all URL parameters except for optional ones (i.e. `'/test/:x?'`).

Adds a new application helper function in app.locals (named 'url' by default) with the signature `url(routeName, replacements)`

## Middleware

### res.redirectToRoute([status], routeName, [parameters])

* `status (optional)` Optional status code number (e.g. 301).
* `routeName` See helper description.
* `parameters (optional)` See helper description.

## Tests

`npm test`

## License

The MIT License (MIT)

Copyright (c) 2013 Joe Lutz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
