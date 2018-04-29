var express = require("express");
var https = require('https');
var fs = require('fs');

var app = express();
app.use(express.static('./public'));

var credentials = { 
    key: fs.existsSync('./priv.key') ? fs.readFileSync('./priv.key', 'utf8') : null, 
    cert: fs.existsSync('./pub.cert') ? fs.readFileSync('./pub.cert', 'utf8') : null
};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, function() {
    console.log(`HTTPS laeuft an Port 443.`);
});
