
# do-respond

[![Build Status via Travis CI](https://travis-ci.org/whitelife/do-respond.svg?branch=master)](https://travis-ci.org/whitelife/do-respond)
[![NPM version](https://img.shields.io/npm/v/do-respond.svg)](https://www.npmjs.org/package/do-respond)
[![Coverage Status](https://coveralls.io/repos/github/whitelife/do-respond/badge.svg?branch=master)](https://coveralls.io/github/whitelife/do-respond?branch=master)
[![Code Climate](https://codeclimate.com/github/whitelife/do-respond/badges/gpa.svg)](https://codeclimate.com/github/whitelife/do-respond)

do respond library

## Installation

```
npm install do-respond
```

## Quick Start

```javascript
'use strict';

const debug = require('debug')('test');
const http = require('http');
const DoRespond = require('do-respond');

http.createServer((req, res) => {

    const doRespond = new DoRespond(req, res, debug);
    doRespond.json(200, { hello: 'world' });
}).listen(8080);
```

## Error Handling

- Domain: https://nodejs.org/dist/latest-v6.x/docs/api/domain.html

```javascript
'use strict';

const debug = require('debug')('test');
const domain = require('domain');
const http = require('http');
const DoRespond = require('do-respond');

http.createServer((req, res) => {

    const lastError = (err) => {
        try {
            // error prossing...
            res.writeHead(500);
            res.end(`err: ${err.message}`);
        } catch (e) {
            // error alert to process exit
            debug(`protect catch err: ${e.message}`);
        }
    }

    // Domain
    const protect = domain.create();

    protect.add(req);
    protect.add(res);

    protect.on('error', (err) => {
        lastError(err);
    });

    protect.run(() => {
        const doRespond = new DoRespond(req, res, debug);

        // Explicit Binding Domain
        doRespond.json(200, { hello: 'world' }, (err) => {
            // protect error event emit

        });
    });
}).listen(8080);
```

## API

## Constructor(req, res, log)

- req: incoming message object
- res: server response object
- log: debug, console object (require('debug') || console.log)

```javascript
const DoRespond = require('do-respond');
const doRespond = new DoRespond(req, res, require('debug') || console.log);
```

## text(code, body, done)

- code: http status code
- body: http body
- done: function (optional)

```javascript
doRespond.text(200, 'hello world', (err) => {
    // res finished.
});
```

## xml(code, body, done)

- code: http status code
- body: http body (object)
- done: function (optional)

```javascript
doRespond.xml(200, { hello: 'world' }, (err) => {
    // res finished.
});
```

## json(code, body, done)

response content-type: application/json

- code: http status code
- body: http body (object)
- done: function (optional)

```javascript
doRespond.json(200, { hello: 'world' }, (err) => {
    // res finished.
});
```

## textJson(code, body, done)

response content-type: text/html

- code: http status code
- body: http body (object)
- done: function (optional)

```javascript
doRespond.textJson(200, { hello: 'world' }, (err) => {
    // res finished.
});
```

## respond(code, headers, body, done)

- code: http status code
- headers: http headers
- body: http body
- done: function (optional)

```javascript
doRespond.respond(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' })
}, JSON.stringify({ hello: 'world' }), (err) => {
    // res finished.
});
```
