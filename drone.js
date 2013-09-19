var droneClient = require('ar-drone').createClient();
var _ = require('underscore');

var droneMock = {
  front: _.partial(console.log,'Front'),
  stop: _.partial(console.log,'Stopping'),
  clockwise: _.partial(console.log,'clockwise'),
  clockwise: _.partial(console.log,'clockwise'),
  land: _.partial(console.log,'landing'),
  on : _.partial(console.log, 'On listener'),
  takeoff: _.partial(console.log, 'Taking off')
};

// droneClient = droneMock;

var stopAndCallback = function (cb) {
  return function () {
    droneClient.stop();
    console.log("stopped now calling the done function");
    setTimeout(cb, 300);
  }
};

var setTimeoutWithPeriodicUpdate = function (frequency, howLong, callback) {
  
}
var drone = {
  x : 0, y : 0, z : 0,
  currentAction : null,
  init: function init (cb) {
    droneClient.ftrim();
    droneClient.config('general:navdata_data_demo', false);
    droneClient.config('control:outdoor', false); // This is not outdoor. 
    droneClient.config('control:flight_without_shell', false); // Using the shell all the time
    droneClient.takeoff();
    console.log('taking off');
    setTimeout(cb, 5000);
    return drone
  },
  on: function(event, fn){
    var throttled = _.throttle(fn);
    droneClient.on(event, function (data) {
      var dataWithPosition;
      drone.currentData = data;
      if(data.demo && (data.demo.controlState === 'CTRL_HOVERING' ||data.demo.controlState === 'CTRL_FLYING')){
        dataWithPosition = _.extend({}, data, {x: drone.x, y: drone.y});
        return throttled(dataWithPosition, 10);
      }
    });
  },
  forward: function forwardMaker(units) {
    return function forward(cb) {
      console.log("Going front.", "for", units * 100, 'ms')
      droneClient.front(0.1);
      setTimeout(stopAndCallback(cb), units * 100 );
      return drone;
    }
  },
  turn: function turnMaker (angle) {
    return function turn(cb) {
      console.log("Turning at.", angle, "rotating for ", angle * 10, 'ms');
      var startData = drone.currentData.demo.clockwiseDegrees;
      droneClient.clockwise(0.60);
      setTimeout(stopAndCallback(cb), angle * 10);
      return drone;
    }
  },
  penDown: function penDown(cb) {
    return drone;
  },
  reset: function reset (cb) {
    stopAndCallback(cb)();
    return drone;
  },
  shutdown: function shutdown (cb) {
    droneClient.land();
    setTimeout(cb, 100);
  },
  moveRight: function (units) {
    return function right (cb) {
      console.log("Moving right at .1 for ", units * 500, 'ms');
      droneClient.right(.1);
      var intervalId = setInterval(function () {
        drone.x += 1
      }, 50);
      setTimeout(stopAndCallback(function () {
        clearInterval(intervalId);
        cb();
      }), units*500);
    };
  },
  moveLeft: function (units) {
    return function left (cb) {
      droneClient.left(.1);
      console.log("Moving left at .1 for ", units*500, 'ms');
      var intervalId = setInterval(function () {
        drone.x -= 1
      }, 50);
      setTimeout(stopAndCallback(function () {
        clearInterval(intervalId);
        cb();
      }), units*500);
    };
  },
  up: function (units) {
    return function up (cb) {
      droneClient.up(.1);
      console.log("Moving up at .1 for ", units * 200, 'ms');
      setTimeout(stopAndCallback(cb), units * 200);
    };
  },
  down: function (units) {
    return function down (cb) {
      droneClient.down(.1);
      console.log("Moving down at .1 for ", units*200, 'ms');
      setTimeout(stopAndCallback(cb), units * 200);
    };
  }
};

drone.right = function (val) {
  if(!val ){
    val = 90;
  }
  return drone.turn(val);
};
drone.left = function (val) {
  if(!val){
    val = 90;
  }
  val = val + 180;
  return drone.turn(val);
};

drone.back = _.partial(drone.turn, 180)();
drone.home = drone.reset;
module.exports = drone;