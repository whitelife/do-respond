
# do-respond

do respond library

## Installation

```
npm install do-respond
```

## Test Coverage

```
=============================== Coverage summary ===============================
Statements   : 75.64% ( 59/78 )
Branches     : 53.85% ( 14/26 )
Functions    : 100% ( 6/6 )
Lines        : 75.64% ( 59/78 )
================================================================================
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

## Callback Error Handling

- Domain: https://nodejs.org/dist/latest-v6.x/docs/api/domain.html

If you want to nest Domain objects as children of a parent Domain, then you must explicitly add them.
Do not `domain.bind(callback)`, the process will die.

```javascript

'use strict';

const debug = require('debug')('test');
const domain = require('domain');
const http = require('http');
const DoRespond = require('../lib/DoRespond');

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
    // https://nodejs.org/dist/latest-v6.x/docs/api/domain.html#domain_implicit_binding

    // Implicit Binding Domain
    const protect = domain.create();

    protect.add(req);
    protect.add(res);

    protect.on('error', (err) => {
        lastError(err);
    });

    const callbackProtect = domain.create();

    callbackProtect.on('error', (err) => {
        lastError(err);
    });

    protect.run(() => {
        const doRespond = new DoRespond(req, res, debug);

        // Explicit Binding Domain
        doRespond.json(200, { hello: 'world' }, callbackProtect.bind((err) => {
            // protect error event emit

        }));
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
doRespond.text(200, 'hello world');
doRespond.text(200, 'hello world', (err) => {
    // res finished.
});
```

## xml(code, body, done)

- code: http status code
- body: http body (object)
- done: function (optional)

```javascript
doRespond.xml(200, { hello: 'world' });
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
doRespond.json(200, { hello: 'world' });
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
doRespond.textJson(200, { hello: 'world' });
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
}, JSON.stringify({ hello: 'world' }));
doRespond.respond(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' })
}, JSON.stringify({ hello: 'world' }), (err) => {
    // res finished.
});
```
