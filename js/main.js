var handWaving;
var context = new AudioContext();

function HandWaving() {
  this.angleLimit = 60;
  // context = 

  bufferLoader.load('hw/sounds/guitar.mp3', setup, context);

  function setup (audioBuffer) {
    this.HandWaving.prototype.audioBuffer = audioBuffer;
    this.HandWaving.prototype.scheduler = createScheduler(context);
    this.HandWaving.prototype.engine = createGranularEngine(audioBuffer, context, "autonomousEngine");
    this.HandWaving.prototype.scheduler.makeSchedulable(this.HandWaving.prototype.engine);
    this.HandWaving.prototype.setup();
  }
}

HandWaving.prototype.setup = function (audioBuffer) {

  var that = this;

  this.engine.enable(true);
  this.engine.scheduler.schedule(this.engine);
  // that.osc = context.createOscillator();
  // that.filter = context.createBiquadFilter();
  // that.gain = context.createGainNode();

  // that.osc.type = 1;
  // that.gain.gain.value = 1;

  // that.osc.connect(that.gain);
  // that.gain.connect(context.destination);

  $('#play-pause').hide();
  $('#theta').hide();
  $('#start-web-audio-api').on('click', function() {
    that.startWebAudioAPI();
    $('#start-web-audio-api').hide();
    // $('#play-pause').show();
  });

  $('#play-pause').on('click', function() {
    that.toggleGain();
  });

  // window.addEventListener('deviceorientation', function(e) {
  //   var beta = e.beta;
  //   var gamma = e.gamma;
  //   that.deviceOrientationHandler(beta, gamma);
  // });

  window.addEventListener('devicemotion', function(e) {
    var x = e.accelerationIncludingGravity.x;
    var y = e.accelerationIncludingGravity.y;
    var z = e.accelerationIncludingGravity.z;
    that.deviceMotionHandler(x, y, z);
  });
};

// HandWaving.prototype.deviceMotionHandler = function (x, y, z) {
//   var theta = Math.atan2(y, x);
//   this.maxFreq = 523.25;
//   this.minFreq = 349.23;
//   this.angleLimit = Math.PI / 4;
//   if (theta < - Math.PI / 2 - this.angleLimit || (theta < Math.PI && theta > Math.PI / 2)) {
//     this.osc.frequency.value = this.minFreq;
//     $('body').removeClass('white');
//     $('body').removeClass('red');
//     $('body').addClass('blue');
//   } else if (theta > - Math.PI / 2 + this.angleLimit) {
//     this.osc.frequency.value = this.maxFreq;
//     $('body').removeClass('white');
//     $('body').removeClass('blue');
//     $('body').addClass('red');
//   } else {
//     this.osc.frequency.value = (this.maxFreq - this.minFreq) / (2 * this.angleLimit) * (theta + Math.PI / 2 + this.angleLimit) + this.minFreq;
//     $('body').removeClass('blue');
//     $('body').removeClass('red');
//     $('body').addClass('white');
//   }
//   // this.updateFrequency(theta);
//   $("#theta").html(theta);
// };

HandWaving.prototype.deviceMotionHandler = function (x, y, z) {
  var theta = Math.atan2(y, x);
  var thetaMin = - Math.PI / 2 - this.angleLimit;
  var thetaMax = - Math.PI / 2 + this.angleLimit;
  var thetaInBufferTime;

  this.maxFreq = 523.25;
  this.minFreq = 349.23;
  this.angleLimit = Math.PI / 4;
  if (theta < - Math.PI / 2 - this.angleLimit || (theta < Math.PI && theta > Math.PI / 2)) {
    thetaInBufferTime = 0;

    $('body').removeClass('white');
    $('body').removeClass('red');
    $('body').addClass('blue');
  } else if (theta > - Math.PI / 2 + this.angleLimit) {
    thetaInBufferTime = this.audioBuffer.duration - 0.3;
    $('body').removeClass('white');
    $('body').removeClass('blue');
    $('body').addClass('red');
  } else {
    thetaInBufferTime = (theta - thetaMin) / (thetaMax - thetaMin) * (this.audioBuffer.duration - 0.3);
    $('body').removeClass('blue');
    $('body').removeClass('red');
    $('body').addClass('white');
  }
  console.log(thetaInBufferTime);
  this.engine.position = thetaInBufferTime;
  // this.updateFrequency(theta);
  $("#theta").html(theta);
};

HandWaving.prototype.updateFrequency = function (theta) {

};

HandWaving.prototype.startWebAudioAPI = function() {
  var frequencies = [329.63, 392.00, 523.25];
  var noteLength = 0.1;
  for (var i = 0; i < frequencies.length; i++) {
    var osc = context.createOscillator();
    var gain = context.createGainNode();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(context.destination);
    this.playNote(osc, frequencies[i], i * noteLength, noteLength);
  }
};

HandWaving.prototype.playNote = function(osc, freq, time, duration) {
  osc.frequency.value = freq;
  osc.start(time);
  osc.stop(time + duration);
};

HandWaving.prototype.toggleGain = function () {
  this.gain.gain.value = 1 - this.gain.gain.value;
};

$(document).ready(function () {
  handWaving = new HandWaving();
  $(document).on('touchmove', function(e) {
    e.preventDefault();
  });
});