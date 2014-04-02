/**
 * @fileoverview WAVE audio library granular web audio transporter,
 * which drives transportable objects (mostly audio engines).
 * @author Karim Barkati
 * @version 0.2.4
 */


/**
 * Function invocation pattern for object creation.
 * @public
 */

var createTransporter = function createTransporter(scheduler, audioContext, optName) {
  'use strict';
  /* global console */

  /**
   * ECMAScript5 property descriptors object.
   */

  var transporterObject = {

    // Properties with default values
    position: { // buffer position (in sec)
      writable: true,
      value: 0
    },
    speed: { // Playback speed
      writable: true,
      value: 1
    },
    playing: {
      writable: true,
      value: false
    },
    paused: {
      writable: true,
      value: false
    },
    scheduler: {
      writable: true,
      value: false
    },
    transportingList: {
      writable: true,
      value: []
    },

    // Other properties
    context: {
      writable: true
    },
    syncTime: {
      writable: true
    },
    syncPosition: {
      writable: true
    },
    // required property for a schedulable object 
    nextEventTime: {
      writable: true
    },


    /**
     * Mandatory initialization method.
     * @public
     * @chainable
     */
    init: {
      enumerable: true,
      value: function(scheduler, audioContext, optName) {

        this.scheduler = scheduler;
        this.context = audioContext;
        this.name = optName;

        // // Create web audio nodes, relying on the given audio context.
        // this.gainNode = this.context.createGain();
        // this.outputNode = this.context.createGain(); // dummy node to provide a web audio-like output node
        // this.connect(this.context.destination); // default destination
        return this; // for chainability
      }
    },

    /**
     * Compute position from time and speed, wrt the last synchronization.
     * @public
     */
    getPositionAtTime: {
      enumerable: true,
      value: function(time) {
        if (this.playing) {
          this.position = (this.syncPosition + ((time - this.syncTime) * this.speed)); // % this.bufferDuration;
          this.synchronize(time, this.position);
        }
        return this.position;
      }
    },

    /**
     * Cross-register transportable object and this object.
     * @public
     * @chainable
     */
    makeTransportable: {
      enumerable: true,
      value: function(transportable) {
        if (transportable) {
          this.transportingList.push(transportable);
          this.scheduler.makeSchedulable(transportable);
        } else {
          throw "Transportable object registering error";
        }
        return this; // for chainability
      }
    },

    /**
     * Start playing.
     * @public
     */
    start: {
      enumerable: true,
      value: function() {

        function startEach(element, index, array) {
          element.enable(true);
        }
        if (this.playing === false) { // prevent event looping
          this.synchronize(this.context.currentTime, this.position);
          this.transportingList.forEach(startEach);
          this.playing = true;
          this.paused = false;
          return this.position;
        }
      }
    },

    /**
     * Stop playing.
     * @public
     */
    stop: {
      enumerable: true,
      value: function() {
        function stopEach(element, index, array) {
          element.enable(false);
          element.position = 0; /** @todo Check if "position" property exists. */
        }
        if (this.playing) {
          this.transportingList.forEach(stopEach);
        }
        if (this.playing || this.paused) {
          this.playing = false;
          this.paused = false;
          this.position = 0;
          return this.position;
        }
      }
    },

    /**
     * Pause playing.
     * @public
     */
    pause: {
      enumerable: true,
      value: function() {
        function pauseEach(element, index, array) {
          element.enable(false);
        }
        if (this.playing === true) {
          this.transportingList.forEach(pauseEach);
          this.playing = false;
          this.paused = true;
          return this.position;
        }
      }
    },

    /**
     * Set position in buffer.
     * @public
     */
    seek: {
      enumerable: true,
      value: function(position) {
        if (!isNaN(parseFloat(this.position))) { // number check
          this.position = position;
        } else {
          throw "Seeking error";
        }
      }
    },

    /**
     * Record position and time.
     * @private
     */
    synchronize: {
      enumerable: false,
      value: function(time, position) {
        this.syncTime = time;
        this.syncPosition = position;
      }
    },

    /**
     * Implement required method for a schedulable object,
     * by simply delegating the method to the binded transportable object,
     * and updating the "nextEventTime" property.
     * @private
     */
    computeNextEventTime: {
      enumerable: false,
      value: function() {
        this.nextEventTime = this.transportingList.computeNextEventTime();
        return this.nextEventTime;
      }
    },

    /**
     * Implement required method for a schedulable object,
     * by simply delegating the method to the binded transportable object,
     * returning the "nextEventTime" property.
     * @private
     */
    getNextEventTime: {
      enumerable: false,
      value: function() {
        return this.transportingList.getNextEventTime();
      }
    },

  }; // End of object definition.


  // Instantiate an object and initialize it.
  var myInstance = Object.create({}, transporterObject);
  return myInstance.init(scheduler, audioContext, optName);
};


// CommonJS function export
// module.exports = createTransporter;