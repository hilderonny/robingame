const express = require("express");
const http = require('http');
const https = require('https');
const fs = require('fs');
const request = require("request");
const Db = require('./utils/db').Db;

(async function() {

    await Db.init();

    var app = express();
    app.use(express.static('./public'));
    app.use(require('body-parser').json());

    app.use("/api/siedler/pokemon", require("./api/siedler/pokemon"));
    app.use("/api/voxel-hoxel/voxel-hoxel", require("./api/voxel-hoxel/voxel-hoxel"));

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

    // Fetch Pokemon sprites 

    // function downloadsprite(index) {
    //     var number = ("000" + index).slice(-3);
    //     var url = `https://media.bisafans.de/d3ea777//pokemon/artwork/${number}.png`;
    //     request(url).pipe(fs.createWriteStream(`./public/qr/pokemon/${number}.png`));
    // }

    // number = 807;

    // function doit() {
    //     if (number > 0) setTimeout(() => {
    //         console.log(number);
    //         downloadsprite(number);
    //         number--;
    //         doit();
    //     }, 250);
    // }

    // doit();
}());