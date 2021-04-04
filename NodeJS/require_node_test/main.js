const test = require('./module1');

console.log(test);

test.say1("oi viado");

setImmediate(() => {
    console.log('The index.js module object is now loaded!' , module)
  });