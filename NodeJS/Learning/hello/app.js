var msg = 'Hello World';
console.log('teste')
var vector = [];
vector[0] = 1;
console.log(vector[0]);

const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

for (let i = 0; i < 3; i++) {
  
  rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.close();
  });
}