const express = require('express');
const router = express.Router();
const cors = require('cors');
const fs = require('fs');

router.use(cors());

//var contacts = exports.usersContactsList;
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
    //let contacts = exports.usersContactsList.find(o => o.userId == req.user.id);
    res.json(req.user.contacts);
});

router.post('/novoCadastro', function (req, res) {
    req.user.contacts.push(loadContacts(req));
    writeOnJSON(req.user.contacts, req.user.id);
    res.json('Successfully created');
    //return sendEventsToAll(newData);
});

router.put('/updateCadastro/:id', (req, res) => {
    const ids = req.params.id;
    req.user.contacts[ids - 1] = loadContacts(req);
    writeOnJSON(req.user.contacts, req.user.id);
    res.json('Successfully updated');

});

router.delete('/:id', (req, res) => {
    const ids = req.params.id;//Indice do contato no Array contacts

    if (req.user.contacts.length > ids - 1) {
        req.user.contacts.splice(ids - 1, 1);
        writeOnJSON(req.user.contacts, req.user.id);
        res.json('Successfully deleted');
    } else {
        res.status(500).send('índice do contato para deletar não existe');
    }
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

            let testAddress = false;
            for (let i in newAddress) {
                if (newAddress[i]) testAddress = true;
            }
            console.log('teste Address: ', testAddress)
            if (testAddress) addressList.push(newAddress);

        }
    } else {
        let newAddress = new Object();

        newAddress.cep = req.body.cep;
        newAddress.Logradouro = req.body.street;
        newAddress.Número = req.body.number;
        newAddress.Complemento = req.body.complement;
        newAddress.Bairro = req.body.district;
        newAddress.Localidade = req.body.city;
        newAddress.Estado = req.body.state;
        //console.log(newAddress);
        let testAddress = false;
        for (let i in newAddress) {
            if (newAddress[i]) testAddress = true;
        }
        console.log('teste Address: ', testAddress)
        if (testAddress) addressList.push(newAddress);
    }
    newData.address = addressList;
    console.log('######### Load', newData);
    return newData;
}


async function writeOnJSON(jsonContent, userId) {
    console.log(`${userId}.json`);
    fs.writeFile(`dataBase/${userId}.json`, JSON.stringify(jsonContent, null, 2), function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
};

module.exports = router;