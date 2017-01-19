
# do-respond

do respond library

## Installation

```
npm install do-respond
```

## Quick Start

```javascript
const debug = require('debug')('test');
const http = require('http');
const DoRespond = require('do-respond');

http.createServer((req, res) => {

    const doRespond = new DoRespond(req, res, debug);
    doRespond.json(200, { hello: 'world' });
}).listen(8080);
```

## Callback Error Handling

If you do not `domain.bind(callback)`, the process will die.

```javascript
const debug = require('debug')('test');
const domain = require('domain');
const http = require('http');
const DoRespond = require('do-respond');

http.createServer((req, res) => {

    const protect = domain.create();

    protect.on('error', (err) => {
        // error prossing...
    });

    const doRespond = new DoRespond(req, res, debug);
    doRespond.json(200, { hello: 'world' }, protect.bind((err) => {
        // protect error event emit
        throw new Error('test error');
    }));
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
