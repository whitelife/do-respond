
'use strict';

const debug = require('debug')('simple');
const http = require('http');
const DoRespond = require('../lib/DoRespond');

http.createServer((req, res) => {

    const doRespond = new DoRespond(req, res, debug);
    doRespond.text(200, 'hello world');
}).listen(8080);
