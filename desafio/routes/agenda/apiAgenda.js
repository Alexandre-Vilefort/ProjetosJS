const express = require('express');
const router = express.Router();
const cors = require('cors');
//const fs = require('fs');

router.use(cors());

var contacts = require('../../data.json');
const users = require('../../users.json');

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

router.post('/novoCadastro', function(req,res){
    contacts.push(loadContacts(req));
    writeOnJSON(contacts);
    res.json('Successfully created');
    //return sendEventsToAll(newData);
});

router.put('/updateCadastro/:id', (req, res) => {
    const { id } = req.params;
    contacts[id-1] = loadContacts(req);     
    writeOnJSON(contacts);
    res.json('Successfully updated');

});

//Functions-----------#-----------
function sendEventsToAll(newData) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(newData)}\n\n`))
}

function loadContacts(req) {

    //Fazer validação dos dados
    var newData = new Object(); 
    newData.name = req.body.name;
    newData.email = req.body.email;
    newData.categories = req.body.categories;
    newData.phone = req.body.phone;
    var addressList = [];
    if (Array.isArray(req.body.cep)) {
        for (let i = 0; i < req.body.cep.length; i++) {
            let newAddress = new Object();

            newAddress.cep = req.body.cep[i];
            newAddress.Logradouro = req.body.street[i];
            newAddress.Número = req.body.number[i];
            newAddress.Complemento = req.body.complement[i];
            newAddress.Bairro = req.body.district[i];
            newAddress.Localidade = req.body.city[i];
            newAddress.Estado = req.body.state[i];

            console.log(newAddress);
            addressList.push(newAddress);
        }
    } else {
        let newAddress = new Object();

        newAddress.cep = req.body.cep;
        newAddress.logradouro = req.body.street;
        newAddress.número = req.body.number;
        newAddress.complemento = req.body.complement;
        newAddress.bairro = req.body.district;
        newAddress.localidade = req.body.city;
        newAddress.estado = req.body.state;
        //console.log(newAddress);
        addressList.push(newAddress);
    }
    newData.address = addressList;
    console.log('######### Load',newData);
    return newData; 
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