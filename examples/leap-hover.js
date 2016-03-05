"use strict";

var cfble = require('../index.js');
var Cylon = require("cylon");

var activated = false;
var cf;

var cflieCB = function(err, crf) {

  if (err || !crf) {
    console.log('Could not connect to Crazyflie');
    process.exit(0);
  }

  console.log("CrazyFlie connected.");
  activated = true;

  cf = crf;

  cf.setThrust(0);
  cf.start();
}

// Test function that tells the crazyflie to hover for 10 seconds
var hover = function(err, cf) {

  cf.setThrust(100); // Adjust as needed
  console.log("Thrust now set to: " + cf.thrust);

  cf.start();
  console.log('Crazyflie now starting...');

  cf.sendParam(11, 'b', 1); // Set the hover param
  
  var i = 20; // 20 seconds
  i *= 2; // double it since we are sending every half a second
  var interval = setInterval(function(){ // Send 32767 to make CF hover
    cf.sendAll(0, 0, 0, 32767);
    i--;
    if(i == 0){
      clearInterval(interval);
      cf.sendParam(11, 'b', 0); // Clear the hover param
      cf.stop();
      console.log('Crazyflie now stopping...');
    }
  }, 500);
};

var cflie = cfble.Crazyflie(cflieCB);

Cylon.robot({
  connections: {
    leapmotion: { adaptor: "leapmotion" }
  },

  devices: {
    leapmotion: { driver: "leapmotion" }
  },

  work: function(my) {

    var hovering = false;
    var detected = false;
    var p = 0, r = 0, y = 0, t = 0;

    var fc = 0;

    console.log('Now listening for leap');

    my.leapmotion.on("frame", function(frame) {
      
      if(!activated) {
        return;
      }

      if(fc++ % 10 != 0) {
        return;
      }

      if(frame.hands.length > 0) {

        if(detected) {
          return;
        }

        else {
          detected = true;
          t = 100;
          cf.sendParam(11, 'b', 1);
        }
      }

      else {

        if(detected) {
          t = 0;
          cf.sendParam(11, 'b', 0);
          detected = false;
        }
      }

      cf.sendAll(r, p, y, t);

    });
  }
}).start();