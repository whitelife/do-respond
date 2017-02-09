
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
        let headers = {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    xml(code = 200, body = '', done) {
        body = this.xmlBuilder.buildObject(body);
        let headers = {
            'Content-Type': 'application/xml; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    json(code = 200, body = '', done) {
        body = JSON.stringify(body);
        let headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    textJson(code = 200, body = '', done) {
        body = JSON.stringify(body);
        let headers = {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        };

        this.respond(code, headers, body, done);
    }

    respond(code = 200, headers = {}, body, done) {
        this._respond(code, headers, body, done);
    }

    _respond(code = 200, headers = {}, body, done) {

        const callbackProtect = domain.create();

        callbackProtect.on('error', (err) => {
            this.log('respond callback protect error stack: ' + err.stack);
        });

        const isFinished = onFinished.isFinished(this.res);
        this.log(`res finished: ${isFinished}, res headers sent: ${this.res.headersSent}`);

        if (isFinished === false && this.res.headersSent === true) {
            this.log(`res headers after they are sent.`);
            this.res.end();
        }

        if (isFinished === false && this.res.headersSent === false) {
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
        }

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
