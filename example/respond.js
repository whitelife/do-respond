
'use strict';

const debug = require('debug')('simple');
const http = require('http');
const DoRespond = require('../lib/DoRespond');

http.createServer((req, res) => {

    const doRespond = new DoRespond(req, res, debug);
    doRespond.respond(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' }))
    }, JSON.stringify({ hello: 'world' }), (err) => {
        debug('done');
    });
}).listen(8080);
