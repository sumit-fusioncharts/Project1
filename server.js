var express = require('express')
var app = express()
var PORT = process.env.PORT || 8080
var path = require('path')

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use("/style", express.static(__dirname + '/style'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/json", express.static(__dirname + '/json'));
app.listen(PORT, function () {
  console.log('Example app listening on port : '+ PORT)
})