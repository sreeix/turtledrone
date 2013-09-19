var drone  = require('ar-drone').createClient();


var commander = {
  init: function (done) {
    drone.takeoff();
    setTimeout(done, 5000);
  }
};

module.exports = commander;