
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
        // If you want to nest Domain objects as children of a parent Domain, then you must explicitly add them.
        doRespond.json(200, { hello: 'world' }, callbackProtect.bind((err) => {
            // protect error event emit

        }));
    });
}).listen(8080);
