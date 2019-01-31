const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {}; // ---> REMOVE

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error');
      return 0;
    } else {
      items[id] = text; // ----> REMOVE
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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    var dataArray = data.map((value) => {
      var id = value.slice(0, -4);
      return {id: id, text: id};
    });
    callback(null, dataArray);
  });

  // var data = _.map(items, (text, id) => {
  //   console.log('{id,text}:', {id, text});
  //   console.log('items:', items);
  //   return { id, text };
  // });

};

exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, todoText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: todoText });
    }
  })
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
