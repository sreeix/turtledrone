var net = require('net');
var commander = require('./commander');
var HOST = '0.0.0.0';
var PORT = 9999;




commander.init(function () {
  console.log("drone ready for commands:");
  net.createServer(function(sock) {
      console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

      // Add a 'data' event handler to this instance of socket
      sock.on('data', function(data) {
          sock.write('You said "' + data + '"');
          commander.exec(data);
      });
      sock.on('close', function(data) {
          console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
      });
  }).listen(PORT, HOST);
  console.log('Server listening on ' + HOST +':'+ PORT);  
});
