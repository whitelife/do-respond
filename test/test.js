
'use strict';

const debug = require('debug')('test');
const domain = require('domain');
const http = require('http');
const DoRespond = require('../lib/DoRespond');

const should = require('should');

const request = require('superagent');
let server = null;

describe('DoRespond Testing', () => {

    before((done) => {
        server = http.createServer((req, res) => {

            const protect = domain.create();
            protect.add(req);
            protect.add(res);

            protect.on('error', (err) => {
                res.end();
            });

            protect.run(() => {
                debug(`req.url: ${req.url}`);

                const doRespond = new DoRespond(req, res, debug);
                const beheviors = {
                    '/text': () => {
                        doRespond.text(200, 'hello world');
                    },
                    '/textdone': () => {
                        doRespond.text(200, 'hello world', (err) => {

                        });
                    },
                    '/xml': () => {
                        doRespond.xml(200, { hello: 'world' });
                    },
                    '/xmldone': () => {
                        doRespond.xml(200, { hello: 'world' }, (err) => {

                        });
                    },
                    '/json': () => {
                        doRespond.json(200, { hello: 'world' });
                    },
                    '/jsondone': () => {
                        doRespond.json(200, { hello: 'world' }, (err) => {

                        });
                    },
                    '/textJson': () => {
                        doRespond.textJson(200, { hello: 'world' });
                    },
                    '/textJsondone': () => {
                        doRespond.textJson(200, { hello: 'world' }, (err) => {

                        });
                    },
                    '/respond': () => {
                        doRespond.respond(200, {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' }))
                        }, JSON.stringify({ hello: 'world' }));
                    },
                    '/responddone': () => {
                        doRespond.respond(200, {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' }))
                        }, JSON.stringify({ hello: 'world' }), (err) => {

                        });
                    }
                }

                beheviors[req.url](req, res);
            });
        });
        server.listen(30000, '0.0.0.0', () => {
            debug('server listen');
            done();
        });
    });

    it('#text(code, body)', (done) => {
        request
            .get('http://localhost:30000/text')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('hello world');
                done();
            });
    });

    it('#text(code, body, done)', (done) => {
        request
            .get('http://localhost:30000/textdone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('hello world');
                done();
            });
    });

    it('#xml(code, body)', (done) => {
        request
            .get('http://localhost:30000/xml')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);

                let chunks = '';

                res.on('data', (chunk) => {
                    chunks += chunk;
                });

                res.on('end', () => {
                    chunks = String(chunks);
                    chunks.should.deepEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<hello>world</hello>');
                    done();
                });
            });
    });

    it('#xml(code, body, done)', (done) => {
        request
            .get('http://localhost:30000/xmldone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);

                let chunks = '';

                res.on('data', (chunk) => {
                    chunks += chunk;
                });

                res.on('end', () => {
                    chunks = String(chunks);
                    chunks.should.deepEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<hello>world</hello>');
                    done();
                });
            });
    });

    it('#json(code, body)', (done) => {
        request
            .get('http://localhost:30000/json')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#json(code, body, done)', (done) => {
        request
            .get('http://localhost:30000/jsondone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#textJson(code, body)', (done) => {
        request
            .get('http://localhost:30000/textJson')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#textJson(code, body, done)', (done) => {
        request
            .get('http://localhost:30000/textJsondone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#respond(code, body)', (done) => {
        request
            .get('http://localhost:30000/respond')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#respond(code, body, done)', (done) => {
        request
            .get('http://localhost:30000/responddone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    after((done) => {
        server.close(() => {
            done();
        });
    });
});
