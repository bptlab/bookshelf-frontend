var express = require('express');
var request = require('request');

var server = express();

// CORS API proxy
server.use('/chimera/api', function(req, res) {
  if(req.method !== 'GET') {
    return;
  }
  
  var url = 'https://bpt-lab.org/bpt-bookshelf/chimera/api' + req.url;
  console.log(req.url);
  var response = request.get({uri: url, json: req.body});
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  req.pipe(response).pipe(res);
});

server.listen(3000, function () {
  console.log('Server listening on localhost:3000.');
});