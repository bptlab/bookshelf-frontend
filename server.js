var express = require('express');
var request = require('request');
const config = require('./src/config.json');

const server = express();

/* CORS API PROXY SETUP */
server.use('/chimera/api', function (req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return;
  }

  var url = config.api.chimera.base + req.url;
  console.log(url);
  try {
    var response;
    if (req.method == 'GET') {
      response = request.get({ uri: url, json: req.body });
    } else if (req.method == 'POST') {
      response = request.post({ 
        uri: url, 
        json: req.body, 
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    req.pipe(response).pipe(res);
  }
  catch(err) {
    console.log(err);
  }
});

server.listen(3000, function () {
  console.log('Server listening on localhost:3000.');
});
