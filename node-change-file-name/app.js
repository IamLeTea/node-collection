var fs = require('fs');
var source = require("./source.js");
var target = require("./target.js");

source.forEach((item, index) => {
  fs.rename(`input/${item}`, `output/${target[index]}`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
  });
})