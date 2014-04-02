/** 
 * @fileOverview
 * WAVE audio library module for buffer loading.
 * @author Karim Barkati
 * @version 0.1.1
 */


/**
 * Object creation pattern for a buffer loader.
 * @public
 */

var createBufferLoader = function createBufferLoader () {
  'use strict';

  /**
   * Buffer loader object as an ecmascript5 properties object.
   */

  var bufferLoaderObject = {

    /**
     * Main method: load
     * @method Request an audio file, decode it in an AudioBuffer
     * and pass it to a callback.
     * @public
     * @param {AudioContext} context Web Audio API AudioContext
     * @param {URL} url of the audio file to load
     * @param {Function} callback Function when loading finished.
     */
    load: {
      enumerable: true,
      value: function(context, url, callback) {

        url = '/' + url;
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
          // Asynchronously decode the audio file data in request.response
          context.decodeAudioData(
            request.response,
            function(buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              callback(buffer);
            },
            function(error) {
              console.error('decodeAudioData error', error);
            }
          );

        };
        request.onerror = function() {
          alert('bufferLoader: XMLHttpRequest error');
        };

        request.send();
      }
    }
  };

  // Instantiate a buffer loader object.
  var bufferLoader = Object.create({}, bufferLoaderObject);
  return bufferLoader;
}


// CommonJS object export
// exports = createBufferLoader();