/**
 * @fileoverview WAVE audio library web audio "timebase",
 * which provides transportable objects with time translation methods,
 * between running time and positional time.
 * @author Karim Barkati
 * @version 0.3.0
 */


/**
 * Function invocation pattern for object creation.
 * @public
 */

'use strict';
/* global console */



/**
 * ECMAScript5 property descriptors object.
 */

var timebaseObject = {

  // Properties with default values
  transporter: {
    writable: true
  },
  syncTime: {
    writable: true
  },
  syncPosition: {
    writable: true,
    value: 0
  },
  syncSpeed: { // Logical speed for synchronize formula, allowed to be zero unlike web audio SourceNode.
    writable: true,
    value: 1
  },
  speed: { // User-level speed.
    writable: true,
    value: 1
  },

  /**
   * Compute position from time and speed, wrt the last synchronization.
   * @public
   */
  getPositionAtTime: {
    enumerable: true,
    value: function(time) {
      if (this.transporter.playing) {
        var position = this.syncPosition + ((time - this.syncTime) * this.syncSpeed);
        this.synchronize(time, position, this.syncSpeed);
      }
      return this.syncPosition;
    }
  },

  /**
   * Compute time from position and speed, wrt the last synchronization.
   * @public
   */
  getTimeAtPosition: {
    enumerable: true,
    value: function(position) {
      if (this.transporter.playing) {
        var time = this.syncTime + ((position - this.syncPosition) / this.syncSpeed);
        this.synchronize(time, position, this.syncSpeed);
      }
      return this.syncTime;
    }
  },

  /**
   * Record position and time.
   * @private
   */
  synchronize: {
    enumerable: false,
    value: function(time, position, speed) {
      this.syncTime = time;
      this.syncPosition = position;
      this.syncSpeed = speed;
    }
  },

  /**
   * Get synchronization speed.
   * @public
   */
  getSpeed: {
    enumerable: true,
    value: function() {
      return this.speed;
    }
  },

  /**
   * Get scheduling period, forwarded from scheduler.
   * @public
   */
  getSchedulingPeriod: {
    enumerable: true,
    value: function() {
      return this.transporter.scheduler.getSchedulingPeriod();
    }
  },
}; // End of object definition.

var timeBase = Object.create({}, timebaseObject);


// CommonJS function export
// module.exports = Object.create({}, timebaseObject);