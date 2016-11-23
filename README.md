
# do-respond

do respond library

## Installation

```
npm install do-respond
```

## Sample Code

```javascript
const debug = require('debug')('test');
const http = require('http');
const DoRespond = require('do-respond');

http.createServer((req, res) => {

    const doRespond = new DoRespond(req, res, debug);
    doRespond.json(200, { hello: 'world'});

    // test statusCode: 200, statusMessage: OK +0ms
    // test header key: Content-Type, value: application/json; charset=utf-8 +3ms
    // test header key: Content-Length, value: 17 +3ms
    // test respond completed. +5ms

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

## json(code, body, done)

- code: http status code
- body: http body (json)
- done: function (optional)

```javascript
doRespond.text(200, { hello: 'world' });
doRespond.text(200, { hello: 'world' }, (err) => {
    // res finished.
});
```

## respond(code, headers, body, done)

- code: http status code
- headers: http headers
- body: http body
- done: function (optional)

```javascript
doRespond.text(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
}, { hello: 'world' });
doRespond.text(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
}, { hello: 'world' }, (err) => {
    // res finished.
});
```
