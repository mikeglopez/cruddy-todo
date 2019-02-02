const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// const readFileAsync = Promise.promisify(fs.readFile);
// const readDirAsync = Promise.promisify(fs.readdir);
Promise.promisifyAll(fs);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error');
      return 0;
    } else {
      fs.writeFileAsync(`${exports.dataDir}/${id}.txt`, text)
        .then(() => {
          callback(null, { id, text });
        })
        .catch((err) => {
          throw err;
        });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir).then((data) => {
    var promiseArray = data.map((value) => {
      var id = value.slice(0, -4);
      return fs.readFileAsync(exports.dataDir + '/' + value, 'utf8');
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
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`, 'utf8')
    .then((todoText) => {
      callback(null, { id, text: todoText });
    })
    .catch(() => {
      callback(new Error(`No item with id: ${id}`));
    });
};

exports.update = (id, text, callback) => {
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`, 'utf8')
    .then(() => {
      console.log('the text is:*****************', text);
      fs.writeFileAsync(`${exports.dataDir}/${id}.txt`, text)
        .then(() => {
          console.log('the text2 is:*****************', text);
          callback(null, text);
        });
    })
    .catch((err) => {
      console.log('This is inside writeFile err#####', err);
      callback(err, null);
    });
};

exports.delete = (id, callback) => {
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`, 'utf8')
    .then(() => {
      fs.unlinkAsync(`${exports.dataDir}/${id}.txt`)
        .then(() => {
          callback();
        });
    })
    .catch(() => {
      callback(new Error(`No item with id: ${id}`));
    });
};
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
