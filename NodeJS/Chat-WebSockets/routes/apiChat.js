const express = require('express');
const router = express.Router();

//var chatText = require('../data.json');
var chatText = [];
//get
router.get('/', (req, res) => {
    res.json(chatText);
    console.log(chatText, 'get no server');
  });

//post
router.post('/', (req, res) => {
    console.log(req.body , '########### Post');
    console.log(req.body);
    chatText.push(req.body);
    console.log(chatText,'post no server');
    res.json('Successfully created');
  });

  module.exports = router;