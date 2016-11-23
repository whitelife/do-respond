
'use strict';

const debug = require('debug')('do-respond');

const domain = require('domain');
const onFinished = require('on-finished');
const statuses = require('statuses');

class DoRespond {

    constructor(req, res, log) {
        this.req = req;
        this.res = res;
        this.log = log || debug;
    }

    text(code = 200, body = '', done) {
        const headers = {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    json(code = 200, body = '', done) {
        try {
            body = JSON.stringify(body);
        } catch (e) {
            this.log(`json stringify error message: ${e.message}`);
        }

        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    respond(code = 200, headers = {}, body, done) {
        const protect = domain.create();
        protect.add(this.req);
        protect.add(this.res);

        protect.on('error', (err) => {
            this.log(`respond protect error stack: ${err.stack}`);

            const isFinished = onFinished.isFinished(this.res);

            if (this.res.headersSent === true) {
                this.log(`res headers sent: ${this.res.headersSent}`);

                if (isFinished === false) {
                    return this.res.end();
                }
            }

            if (isFinished === true) {
                this.log(`res finished: ${isFinished}`);
                return;
            }

            const body = err.message || '';

            this.res.statusCode = 500;
            this.res.statusMessage = statuses[this.res.statusCode];

            this.res.setHeader('Content-Type', 'text/html; charset=utf-8');
            this.res.setHeader('Content-Length', Buffer.byteLength(body));

            this.res.write(body);
            this.res.end();

            onFinished(this.res, (err) => {

                if (err) {
                    this.log(`res finished error message: ${err.message}`);

                    if (done !== undefined) {
                        return done(err);
                    }
                }

                this.log(`respond completed.`);

                if (done !== undefined) {
                    done();
                }
            });
        });

        protect.run(() => {
            const isFinished = onFinished.isFinished(this.res);

            if (this.res.headersSent === true) {
                this.log(`res headers sent: ${this.res.headersSent}`);

                if (isFinished === false) {
                    return this.res.end();
                }
            }

            if (isFinished === true) {
                this.log(`res finished: ${isFinished}`);
                return;
            }

            this.res.statusCode = code;
            this.res.statusMessage = statuses[code];

            this.log(`statusCode: ${this.res.statusCode}, statusMessage: ${this.res.statusMessage}`);

            for (const key of Object.keys(headers)) {
                const value = headers[key];
                this.res.setHeader(key, value);

                this.log(`header key: ${key}, value: ${value}`);
            }

            this.res.write(body);
            this.res.end();

            onFinished(this.res, (err) => {

                if (err) {
                    this.log(`res finished error message: ${err.message}`);

                    if (done !== undefined) {
                        return done(err);
                    }
                }

                this.log(`respond completed.`);

                if (done !== undefined) {
                    done();
                }
            });
        });
    }
}

module.exports = DoRespond;
