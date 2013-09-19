var initialize = function () {
  var canvas = document.getElementById("trails");
  var socket = io.connect('http://localhost');
  var ctx = canvas.getContext("2d");
  socket.on('update', function (data) {
    console.log(data);
    $('.batteryRemaining').val(data.batteryPercentage);
    $('.altitude').val(data.altitude);
    $('.xVelocity').val(data.velocity.x);
    $('.xpostion').val(data.x);
    // $('.yVelocity').val(data.velocity.y);
    // $('.yVelocity').val(data.velocity.y);
    $('.clockwiseDegrees').val(data.clockwiseDegrees);
    $('.controlState').val(data.state);
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (data.x , data.altitude * 200, 5, 5);
  });
};

$(document).ready(initialize);