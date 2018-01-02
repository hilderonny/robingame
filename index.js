var express = require("express");

var server = express();
server.use(express.static('./public'));
server.listen(80, () => {
    console.log("Running on port 80");
});