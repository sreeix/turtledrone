var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  , drone = require('./drone')
  , renderer = require('./sendWords');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app);
var io = require('socket.io').listen(server)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

drone.on('navdata', function (data) {
  console.log("-------------------------");
  console.log(data.x)
  console.log("-------------------------");

  var droneData = {flying: data.droneState.flying, 
    altitude: data.demo.altitude, 
    state: data.demo.controlState,
    x: data.x,
    y: data.y,
    batteryPercentage: data.demo.batteryPercentage, 
    rotation: _.pick(data.demo.rotation,'frontBack', 'pitch', 'yaw', 'theta', 'roll', 'clockwise'),
    velocity: data.demo.velocity,
    clockwiseDegrees: data.demo.clockwiseDegrees
  };
  io.sockets.emit("update", droneData);
});


drone.init(function () {
  console.time("Drawing");
  renderer.draw('S', function (err, res) {
    console.timeEnd("Drawing");
    drone.shutdown(function () {
      process.exit(0);
    });
  });
});


process.on('SIGINT',function () {
  console.log('sigint detected, bringing the drone down. Mind your heads');
  drone.shutdown(function () {
    process.exit(0);
  });
});

