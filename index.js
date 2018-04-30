var express = require("express");
var https = require('https');
var fs = require('fs');

var app = express();
app.use(express.static('./public'));

var credentials = { 
    key: fs.existsSync('./priv.key') ? fs.readFileSync('./priv.key', 'utf8') : null, 
    cert: fs.existsSync('./pub.cert') ? fs.readFileSync('./pub.cert', 'utf8') : null
};

var httpsPort = process.env.HTTPS_PORT || 443;

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, function() {
    console.log(`HTTPS laeuft an Port ${httpsPort}.`);
});
