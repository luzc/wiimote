// ws server
var ws = require('websocket-server');
var wsServer = ws.createServer();
var qs = require('querystring');
var fs = require('fs');
var idx = 0;

wsServer.addListener('connection', function(connection){
  connection.addListener('message', function(msg) {
		var data = JSON.parse(msg);
		console.log('alpha', data.alpha, 'beta', data.beta, 'gamma', data.gamma);
    wsServer.broadcast(msg);
  });
});

wsServer.listen(8080);

// http server
var http = require('http');
var httpServer = http.createServer(function (request, response) {
  if (request.method == 'POST') {
    var body = '';
    request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        var imageUrl = qs.parse(body),
            base64img = imageUrl.base64img,
            buffer = new Buffer(base64img, 'base64'),
            fd =  fs.openSync('image' + idx + '.png', 'w');
        
        fs.write(fd, buffer, 0, buffer.length, 0, function(err,written){
          wsServer.broadcast(JSON.stringify({img: 'image' + idx + '.png'}));
          idx++;
        });
    });
  }
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  response.end('okay');
});

httpServer.listen(8081, '0.0.0.0');

console.log('Server running at http://0.0.0.0:8080/');
