// ws server
var ws = require('websocket-server');
var wsServer = ws.createServer();

wsServer.addListener('connection', function(connection){
  connection.addListener('message', function(msg) {
		var data = JSON.parse(msg);
		console.log('alpha', data.alpha, 'beta', data.beta, 'gamma', data.gamma);
    wsServer.broadcast(msg);
  });
});

wsServer.listen(8080);

console.log('Server running at http://0.0.0.0:8080/');
