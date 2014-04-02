/** 
 * @fileOverview
 * WAVE audio library module for property checking.
 * @author Karim Barkati
 * @version 0.1.0
 */

"use strict";
/* global module, console */

var propertyCheck = function propertyCheck(object, properties) {

  function checkProperties(element, index, array) {
    if (object.hasOwnProperty(element)) {
      // console.log("object.hasOwnProperty(element): ", element, ", checked");
    } else {
      throw "The '" + element + "' property is required";
    }
  }

  properties.forEach(checkProperties);
};

// CommonJS object export
// module.exports = propertyCheck;