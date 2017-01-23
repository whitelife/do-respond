
'use strict';

const debug = require('debug')('do-respond');

const domain = require('domain');

const xml2js = require('xml2js');
const onFinished = require('on-finished');
const statuses = require('statuses');

class DoRespond {

    constructor(req, res, log, options = {
        xmlBuilder: {
            rootName: 'root'
        }
    }) {
        this.req = req;
        this.res = res;
        this.xmlBuilder = new xml2js.Builder(options.xmlBuilder);
        this.log = log || debug;
    }

    text(code = 200, body = '', done) {
        let headers = {};

        try {
            headers = {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': Buffer.byteLength(body)
            };
            this._respond(code, headers, body, done);
        } catch (e) {
            this.log(`text error message: ${e.message}`);

            if (done !== undefined) {
                return done(e);
            }
        }
    }

    xml(code = 200, body = '', done) {
        let headers = {};

        try {
            body = this.xmlBuilder.buildObject(body);
            headers = {
                'Content-Type': 'application/xml; charset=utf-8',
                'Content-Length': Buffer.byteLength(body)
            };
            this._respond(code, headers, body, done);
        } catch (e) {
            this.log(`xml error message: ${e.message}`);

            if (done !== undefined) {
                return done(e);
            }
        }
    }

    json(code = 200, body = '', done) {
        let headers = {};

        try {
            body = JSON.stringify(body);
            headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(body)
            };
            this._respond(code, headers, body, done);
        } catch (e) {
            this.log(`json error message: ${e.message}`);

            if (done !== undefined) {
                return done(e);
            }
        }
    }

    textJson(code = 200, body = '', done) {
        let headers = {};

        try {
            body = JSON.stringify(body);
            headers = {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': Buffer.byteLength(body)
            };
            this._respond(code, headers, body, done);
        } catch (e) {
            this.log(`json error message: ${e.message}`);

            if (done !== undefined) {
                return done(e);
            }
        }
    }

    respond(code = 200, headers = {}, body, done) {
        try {
            this._respond(code, headers, body, done);
        } catch (e) {
            this.log(`respond error message: ${e.message}`);

            if (done !== undefined) {
                return done(e);
            }
        }
    }

    _respond(code = 200, headers = {}, body, done) {

        const callbackProtect = domain.create();

        callbackProtect.on('error', (err) => {
            this.log(`respond callback protect error stack: ${err.stack}`);

            throw err;
        });

        const isFinished = onFinished.isFinished(this.res);

        if (this.res.headersSent === true) {
            this.log(`res headers sent: ${this.res.headersSent}`);

            if (isFinished === false) {
                this.res.end();
            }
        }

        if (isFinished === true) {
            this.log(`res finished: ${isFinished}`);

            if (done !== undefined) {
                return done('res finished.');
            }

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

        onFinished(this.res, callbackProtect.bind((err) => {

            if (err) {
                this.log(`res finished error stack: ${err.stack}`);

                if (done !== undefined) {
                    return done(err);
                }
            }

            this.log(`respond completed.`);

            if (done !== undefined) {
                done();
            }
        }));
    }
}

module.exports = DoRespond;
