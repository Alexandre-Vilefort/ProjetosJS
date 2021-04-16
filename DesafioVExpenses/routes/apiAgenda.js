const express = require('express');
const router = express.Router();
const cors = require('cors');
const fs = require('fs');

router.use(cors());

var contacts = require('../data.json');
//var contacts = [];
let clients = [];
let facts = [];

//get
function eventsHandler(req, res, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    };
    res.writeHead(200, headers);
    const data = `data: ${JSON.stringify(facts)}\n\n`;
    res.write(data);
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);
    console.log(`${clientId} Connection open`)

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
        console.log(clients);
    });
}

router.get('/connect', eventsHandler);

router.get('/', (req, res) => {
    res.json(contacts);
});

router.post('/novoCadastro', addContato);

router.put('/updateCadastro/:id', (req, res) => {
    console.log(req.body, '######### Put')
    const { id } = req.params;
    let newData = req.body;

    for (let contact of contacts) {
        if (contact.id == id) {
            contact.name = newData.name;
            contact.phone = newData.phone;
            contact.email = newData.email;
        }
    };
    writeOnJSON(contacts);
    res.json('Successfully updated');

});



//Functions-----------#-----------
function sendEventsToAll(newData) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(newData)}\n\n`))
}

async function addContato(req, res, next) {
    let newData = req.body;
    newData.id = contacts.length + 1;
    console.log(newData, '######### Post');
    contacts.push(newData);
    writeOnJSON(contacts);
    res.json('Successfully created');
    //return sendEventsToAll(newData);
}


async function writeOnJSON(jsonContent) {
    fs.writeFile('data.json', JSON.stringify(jsonContent, null, 2), function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
};
module.exports = router;