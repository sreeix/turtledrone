var d = require('./drone');
var _ = require('underscore');
var async = require('async');

var renderer = {
  draw: function (word, cb) {
    async.eachSeries(_.toArray(word), renderer.drawChar, cb);
  },
  drawChar: function (ch, done) {
    var execFuns = charStructures[ch.toUpperCase()];
    console.log("--------------------");
    console.log("Drawing Char", ch);
    console.log("--------------------");

    if(execFuns){
      renderer.applyCommands(execFuns, function (err, res) {
        renderer.nextHome(done);
      });
    } else {
      console.log("Character not found", ch)
    }
  },
  nextHome: function (done) {
    renderer.applyCommands([d.moveRight(3)], done)
  },
  applyCommands: function (execFuns, done) {
    async.eachSeries(execFuns, function (fun, cb) {
      console.log("-- applying ", fun.name);
      fun.apply(d, [function (err, res) {
        console.log("-- Function Applied:", fun.name);
        return cb(err, res);
      }]);
    }, done);
  }
};

var charStructures = {
  // "A":[reset, moveTo(5,10), moveTo(10,0), penUp, moveTo(8, 3), penDown, moveTo(2, 3) ],
  "J":[d.home, d.moveRight(5), d.moveLeft(3), d.down(10), d.moveLeft(4)],
  "S":[d.home, d.moveRight(5), d.moveLeft(5), d.down(4), d.moveRight(5), d.down(4), d.moveLeft(5)],
  "F":[d.home, d.moveRight(5), d.moveLeft(5), d.down(5), d.moveRight(3), d.moveLeft(3), d.down(5)],
  "O":[d.down(10), d.moveRight(5), d.up(10), d.moveLeft(5)]
};

module.exports = renderer;

// d.init(function () {
//   console.time("Drawing");
//   renderer.draw('O', function (err, res) {
//     console.timeEnd("Drawing");
//   });
// });

// d.on('navdata', function (data) {
//   // console.log('.');
// })
// 
// process.on('SIGINT',function () {
//   console.log('sigint detected, bringing the drone down. Mind your heads');
//   d.shutdown(function () {
//     process.exit(0);
//   });
// });
// 
// setTimeout(function () {
//   d.shutdown(function () {
//     process.exit(0);
//   });
// 
// }, 30000);
