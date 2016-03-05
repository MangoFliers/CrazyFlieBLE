"use strict";

var cfble = require('../index.js');
var Cylon = require("cylon");

var detected = false;
var cf;

var cflieCB = function(err, crf) {

  if (err || !crf) {
    console.log('Could not connect to Crazyflie');
    process.exit(0);
  }

  console.log("CrazyFlie connected.");
  detected = true;

  cf = crf;

  cf.setThrust(0);
  cf.start();
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

    var interval;
    var activated = false;
    var p = 0, r = 0, y = 0, t = 0;

    var fc = 0;

    console.log('Now listening for leap');

    var controlState = {
      p: 0,
      r: 0,
      y: 0,
      t: 0,

      send: function() {
        cf.sendAll(this.r, this.p, this.y, this.t);
        console.log(this.r, this.p, this.y, this.t);
      },

      update: function(r, p, y, t) {
        this.r = r;
        this.p = p;
        this.y = y;
        this.t = t;
      },

      start: function() {
        var sAll = this.send.bind(this);
        setInterval(function() {
          sAll();
        }, 500);
      }
    }

    my.leapmotion.on("frame", function(frame) {
      
      // y += 1;
      if(detected) {
        if(!activated) {
          activated = true;
          controlState.start();
          console.log('starting interval');
          cf.sendParam(11, 'b', 1);

          // interval = setInterval(function() {
          //     console.log(r,p,y,t);
          //     cf.sendAll(r, p, y, t);
          // }, 200);
        }

        if(frame.hands.length > 0) {

          t = 32767;

          var palm = frame.hands[0].palmNormal;

          // console.log(palm);
          var rawRoll  = palm[0];
          var rawPitch = palm[2];

          r = rawRoll * 100;
          p = rawPitch * 100;


        }

        else {
            t = 0;
        }

        controlState.update(r, p, y, t);
      }

    });
  }
}).start();