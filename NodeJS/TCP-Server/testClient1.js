const net = require('net');
const readlineSync = require('readline-sync');

var client = new net.Socket();
client.connect(9000, '177.106.174.44', inputServer);

client.on('data', function (data) {
    console.log('Received: ' + data);
    console.log(" ---- ")
    let exit = "";
    var answer = readlineSync.question('escreva algo:: ');
    client.write(answer);
    console.log(`Send: ${answer}`);
    exit = answer;
    if (exit == "q") {client.destroy()}; // kill client after server's response
});

function inputServer() {
    var answer = readlineSync.question('Primeira vez:: ');
    client.write(answer);
    console.log(`Send: ${answer}`);
}

client.on('close', function () {
    console.log('Connection closed');
});
