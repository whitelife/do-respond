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
    const protect = domain.create();

    protect.add(req);
    protect.add(res);

    protect.on('error', (err) => {
        lastError(err);
    });

    protect.run(() => {
        const doRespond = new DoRespond(req, res, debug);

        // Explicit Binding Domain
        doRespond.xml(200, { hello: 'world' }, (err) => {
            // protect error event emit

        });
    });
}).listen(8080);
