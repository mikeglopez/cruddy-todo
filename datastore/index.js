const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error');
      return 0;
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, function (err) {
        if (err) {
          throw err;
        } else {
          console.log('Saved!');
          callback(null, { id, text });
        }
      });
    }
  });
};

var readFileAsync = Promise.promisify(fs.readFile);
var readDirAsync = Promise.promisify(fs.readdir);

exports.readAll = (callback) => {
  readDirAsync(exports.dataDir).then((data) => {
    var promiseArray = data.map((value) => {
      var id = value.slice(0, -4);
      return readFileAsync(exports.dataDir + '/' + value, 'utf8');
    });
    var idArray = data.map((value) => {
      var id = value.slice(0, -4);
      return id;
    });

    Promise.all(promiseArray).then((values) => {
      var output = [];
      for (var i = 0; i < values.length; i++) {
        output.push({ id: idArray[i], text: values[i] });
      }
      callback(null, output);
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, todoText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: todoText });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, todoText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('todoText:', todoText);
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, function (err) {
        if (err) {
          console.log('This is inside writeFile err#####', err);
          throw err;
        } else {
          console.log('Saved update!');
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, todoText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, function (err) {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
