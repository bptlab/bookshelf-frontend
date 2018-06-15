var express = require('express'),
    request = require('request');

var app = express();  

// Forward all requests from /api to http://foo.com/api
app.use('/chimera/api', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  req.pipe(request("https://bpt-lab.org/bpt-bookshelf/chimera/api" + req.url)).pipe(res);
});

app.listen(process.env.PORT || 3000);