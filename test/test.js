
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
                    '/testerror': () => {
                        const _doRespond = new DoRespond(req, res);
                        _doRespond.text(200, 'hello world', (err) => {
                            throw new Error('test error');
                        });
                    },
                    '/testdebug': () => {
                        const _doRespond = new DoRespond(req, res);
                        _doRespond.text(200, 'hello world');
                    },
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
                    },
                    '/overlapped': () => {
                        doRespond.json(200, { hello: 'world' }, (err) => {
                            doRespond.json(200, { hello: 'world' });
                        });
                    },
                    '/overlappedtextdone': () => {
                        doRespond.text(200, 'hello world', (err) => {
                            doRespond.text(200, 'hello world', (err) => {

                            });
                        });
                    },
                    '/overlappedxmldone': () => {
                        doRespond.xml(200, { hello: 'world' }, (err) => {
                            doRespond.xml(200, { hello: 'world' }, (err) => {

                            });
                        });
                    },
                    '/overlappedjsondone': () => {
                        doRespond.json(200, { hello: 'world' }, (err) => {
                            doRespond.json(200, { hello: 'world' }, (_err) => {

                            });
                        });
                    },
                    '/overlappedtextjsondone': () => {
                        doRespond.textJson(200, { hello: 'world' }, (err) => {
                            doRespond.textJson(200, { hello: 'world' }, (_err) => {

                            });
                        });
                    },
                    '/overlappedresponddone': () => {
                        doRespond.respond(200, {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' }))
                        }, JSON.stringify({ hello: 'world' }), (err) => {
                            doRespond.respond(200, {
                                'Content-Type': 'application/json; charset=utf-8',
                                'Content-Length': Buffer.byteLength(JSON.stringify({ hello: 'world' }))
                            }, JSON.stringify({ hello: 'world' }), (err) => {

                            });
                        });
                    },
                    '/headerssent': () => {
                        res.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });

                        doRespond.json(200, { hello: 'world' }, (err) => {

                        });
                    },
                    '/changexmlroot': () => {
                        const _doRespond = new DoRespond(req, res, debug, {
                            xmlBuilder: {
                                rootName: 'test'
                            }
                        });
                        _doRespond.xml(200, { hello: 'world' });
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

    it('#constructor(req, res, log, options)', (done) => {
        request
            .get('http://localhost:30000/testdebug')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('hello world');
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

    it('#text(code, body, done):testerror', (done) => {
        request
            .get('http://localhost:30000/testerror')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('hello world');
                done();
            });
    });

    it('#text(code, body, done):overlappedtextdone', (done) => {
        request
            .get('http://localhost:30000/overlappedtextdone')
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

    it('#xml(code, body, done):changexmlroot', (done) => {
        request
            .get('http://localhost:30000/changexmlroot')
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

                    chunks.should.deepEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<test>\n  <hello>world</hello>\n</test>');
                    done();
                });
            });
    });

    it('#xml(code, body, done):overlappedxmldone', (done) => {
        request
            .get('http://localhost:30000/overlappedxmldone')
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

    it('#json(code, body, done):overlapped', (done) => {
        request
            .get('http://localhost:30000/overlapped')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#json(code, body, done):overlappedjsondone', (done) => {
        request
            .get('http://localhost:30000/overlappedjsondone')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('{"hello":"world"}');
                done();
            });
    });

    it('#json(code, body, done):headerssent', (done) => {
        request
            .get('http://localhost:30000/headerssent')
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                res.should.have.property('statusCode', 200);
                res.text.should.deepEqual('');
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

    it('#textJson(code, body, done):overlappedtextjsondone', (done) => {
        request
            .get('http://localhost:30000/overlappedtextjsondone')
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

    it('#respond(code, body, done):overlappedresponddone', (done) => {
        request
            .get('http://localhost:30000/overlappedresponddone')
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
