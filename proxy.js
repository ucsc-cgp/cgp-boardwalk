

var https = require('https'),
    http  = require('http'),
    util  = require('util'),
    path  = require('path'),
    fs    = require('fs'),
    colors = require('colors'),
    httpProxy = require('http-proxy');


var welcome = [
    '#    # ##### ##### #####        #####  #####   ####  #    # #   #',
    '#    #   #     #   #    #       #    # #    # #    #  #  #   # # ',
    '######   #     #   #    # ##### #    # #    # #    #   ##     #  ',
    '#    #   #     #   #####        #####  #####  #    #   ##     #  ',
    '#    #   #     #   #            #      #   #  #    #  #  #    #  ',
    '#    #   #     #   #            #      #    #  ####  #    #   #  '
].join('\n');

console.log(welcome.rainbow.bold);


//
// Create a HTTP Proxy server with a HTTPS target
//
httpProxy.createProxyServer({
    target: 'https://jesse.ucsc-cgp-dev.org',
    agent  : https.globalAgent,
    headers: {
        host: 'jesse.ucsc-cgp-dev.org'
    }
}).listen(3001);

console.log('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '3001'.yellow);