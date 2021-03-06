/** 
 * @fileOverview
 * WAVE audio library module for buffer loading.
 * @author Karim Barkati and Victor Saiz
 * @version 0.2.2
 */

"use strict";
/* global module */


/** 
 * Buffer loader object with several loading methods.
 * @public
 */
var bufferLoader = {

  // Attributes for loadAll closure.
  bufferList: {
    writable: true
  },
  loadCount: {
    writable: true
  },

  /**
   * Main wrapper function for loading.
   * Switch between loadBuffer and loadAll;
   * loadEach has to be called explicitely.
   * @public
   * @param fileURLs The URLs of the audio files to load.
   * @param callback The callback function.
   * @param audioContext The Web Audio API AudioContext.
   */
  load: {
    enumerable: true,
    value: function(fileURLs, callback, audioContext) {
      if (Array.isArray(fileURLs)) {
        this.loadAll(fileURLs, callback, audioContext);
      } else {
        this.loadBuffer(fileURLs, callback, audioContext);
      }
    }
  },

  /**
   * Load a single audio file,
   * decode it in an AudioBuffer
   * and pass it to the callback.
   * @public
   * @param fileURL The URL of the audio file to load.
   * @param callback The callback function when loading finished.
   * @param audioContext The Web Audio API AudioContext.
   */
  loadBuffer: {
    enumerable: true,
    value: function(fileURL, callback, audioContext) {

      var successCallback = function successCallback(buffer) {
        if (!buffer) {
          throw 'error decoding data: ' + buffer;
        }
        callback(buffer);
      };

      var errorCallback = function errorCallback(error) {
        throw 'decodeAudioData error: ' + error;
      };

      var decodeCallback = function decodeCallback(requestCallback) {

        audioContext.decodeAudioData(
          requestCallback.response, // returned audio data array
          successCallback,
          errorCallback
        );
      };

      this.fileLoadingRequest(fileURL, decodeCallback).send();
    }
  },

  /**
   * Load each audio file asynchronously,
   * decode it in an AudioBuffer,
   * and execute the callback for each.
   * @public
   * @param fileURLs The URLs array of the audio files to load.
   * @param callback The callback function when a loading finished.
   * @param audioContext The Web Audio API AudioContext.
   */
  loadEach: {
    enumerable: true,
    value: function(fileURLs, callback, audioContext) {
      var urlsCount = fileURLs.length;

      for (var i = 0; i < urlsCount; ++i) {
        this.loadBuffer(fileURLs[i], callback, audioContext);
      }
    }
  },

  /**
   * Load all audio files at once in a single array,
   * decode them in an array of AudioBuffers,
   * and return a single callback when all loadings finished.
   * @public
   * @param fileURLs The URLs array of the audio files to load.
   * @param callback The callback function when total loading finished.
   * @param audioContext The Web Audio API AudioContext.
   */
  loadAll: {
    enumerable: true,
    value: function(fileURLs, callback, audioContext) {
      var urlsCount = fileURLs.length;
      this.loadCount = 0;
      this.bufferList = [];
      for (var i = 0; i < urlsCount; ++i) {
        this.loadBufferAtIndex(fileURLs[i], callback, audioContext, i, urlsCount);
      }
    }
  },

  /**
   * Load a single audio file,
   * decode it in an AudioBuffer
   * and store it in a buffer list at provided index.
   * @private
   * @param fileURL The URL of the audio file to load.
   * @param callback The callback function when loading finished.
   * @param audioContext The Web Audio API AudioContext.
   */
  loadBufferAtIndex: {
    enumerable: false,
    value: function(fileURL, callback, audioContext, index, urlsCount) {

      var that = this;

      var successCallback = function successCallback(buffer) {
        if (!buffer) {
          throw 'error decoding data: ' + buffer;
        }
        that.loadCount++;
        if (that.loadCount < urlsCount) {
          that.bufferList[index] = buffer;
        } else {
          that.bufferList[index] = buffer;
          callback(that.bufferList); // When all files are loaded.
        }
      };

      var errorCallback = function errorCallback(error) {
        throw 'decodeAudioData error: ' + error;
      };

      var decodeCallback = function decodeCallback(requestCallback) {

        audioContext.decodeAudioData(
          requestCallback.response, // returned audio data array
          successCallback,
          errorCallback
        );
      };

      this.fileLoadingRequest(fileURL, decodeCallback).send();
    }
  },

  /**
   * Load a file asynchronously
   * and pass it to a callback as an 'arraybuffer'.
   * @private
   */
  fileLoadingRequest: {
    enumerable: false,
    value: function(url, callback) {

      // Load buffer asynchronously
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      request.onreadystatechange = function() {
        if (request.readyState != 4) return;
        if (request.status != 200 && request.status != 304) {
          throw 'HTTP error ' + request.status;
        }

        callback(request);
      };

      if (request.readyState == 4) return;
      return request;
    }
  },

};

// CommonJS object export
module.exports = Object.create({}, bufferLoader);