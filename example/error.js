
'use strict';

const debug = require('debug')('test');
const domain = require('domain');
const http = require('http');
const DoRespond = require('../lib/DoRespond');

http.createServer((req, res) => {

    const protect = domain.create();

    protect.on('error', (err) => {
        // error prossing...
        console.error(err);
    });

    const doRespond = new DoRespond(req, res, debug);
    doRespond.json(200, { hello: 'world' }, protect.bind((err) => {
        // protect error event emit
        throw new Error('test error');
    }));
}).listen(8080);
