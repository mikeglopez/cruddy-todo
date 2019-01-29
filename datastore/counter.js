const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  console.log('exports.counterFile:', exports.counterFile)
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      console.log('fileData', Number(fileData));
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (err, data) => {
  // readCounter -> check what current counter is at
  // readCounter will invoke the callback with 'fileData' if it's success
  // write the new Counter to writeCounter
    // what is the last id in 'fileData'
    // writeCouter(count = 'last ID inside fileData', callback);
  readCounter((err = null, fileData) => {
    counter = fileData + 1;
    writeCounter(counter, (err = null, counterString) => {return counterString;})
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
exports.getNextUniqueId();
console.log("This is a file path", exports.counterFile);