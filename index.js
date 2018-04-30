var express = require("express");
var http = require('http');
var https = require('https');
var fs = require('fs');

var app = express();
app.use(express.static('./public'));

var credentials = { 
    key: fs.existsSync('./priv.key') ? fs.readFileSync('./priv.key', 'utf8') : null, 
    cert: fs.existsSync('./pub.cert') ? fs.readFileSync('./pub.cert', 'utf8') : null
};

var httpPort = process.env.HTTP_PORT || 80;
var httpsPort = process.env.HTTPS_PORT || 443;

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, function() {
    console.log(`HTTPS laeuft an Port ${httpsPort}.`);
});

var httpServer = http.createServer(app);
httpServer.listen(httpPort, function() {
    console.log(`HTTP laeuft an Port ${httpPort}.`);
});
