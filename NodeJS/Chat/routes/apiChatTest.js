const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());

//var chatText = require('../data.json');
var chatText = [];
let clients = [];
let facts = [];

//get
function eventsHandler(req, res, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
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
    res.json(chatText);
    //console.log(chatText);
});

router.post('/',addMessage);

function sendEventsToAll(newData) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(newData)}\n\n`))
}

async function addMessage(req,res,next){
    const newMessage = req.body;
    console.log(newMessage);
    chatText.push(newMessage);
    res.json('Successfully created');
    return sendEventsToAll(newMessage);
}

module.exports = router;