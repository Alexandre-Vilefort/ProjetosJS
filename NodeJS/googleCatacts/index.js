const express = require('express');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const request = require('request');
const cors = require('cors');
const urlParse = require('url-parse');
const queryParse = require('query-string');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//setting
app.set('port', process.env.PORT || 8000);
app.set('host', 'localhost');

app.get('/teste', (req, res) => {
    res.send('YEEI');
})

//Client ID:    289033250110-49cpv9860r9ivsjmaktpgt69gbaphmd4.apps.googleusercontent.com
//Client secret:    2mZhNL2xd5skrbjR0KHPkevf
const YOUR_CLIENT_ID = '289033250110-49cpv9860r9ivsjmaktpgt69gbaphmd4.apps.googleusercontent.com'
const YOUR_CLIENT_SECRET = '2mZhNL2xd5skrbjR0KHPkevf'
const YOUR_REDIRECT_URL = 'http://localhost:8000/import'
const SCOPES = ['https://www.googleapis.com/auth/contacts'];

app.get('/getURLImp', (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        YOUR_CLIENT_ID,
        YOUR_CLIENT_SECRET,
        YOUR_REDIRECT_URL
    );
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    });
    request(url, (err, response, body) => {
        if (err) console.log('error: ', err);
        console.log('statusCode: ', response && response.statusCode);
        res.redirect(url);
    })
});

app.get('/import', async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        YOUR_CLIENT_ID,
        YOUR_CLIENT_SECRET,
        YOUR_REDIRECT_URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    //res.redirect('/teste')

    oauth2Client.setCredentials(tokens);
    const service = google.people({ version: 'v1', auth: oauth2Client });
    service
    service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,phoneNumbers',
    }, (err, res) => {
        if (err) {
            return console.error('The API returned an error: ' + err)
        } else { console.log("sem erro") }
        const connections = res.data.connections;
        if (connections) {
            console.log('Connections:');
            connections.forEach((person) => {
                if (person.names && person.names.length > 0) {
                    console.log(person.names[0].displayName);
                } else {console.log('No display name found for connection.')}

                if (person.emailAddresses && person.emailAddresses.length > 0) {
                    console.log(person.emailAddresses[0].value);
                } else {console.log('No display email found for connection.')}

                if (person.phoneNumbers && person.phoneNumbers.length > 0) {
                    console.log(person.phoneNumbers[0].value);
                } else {console.log('No display Phone found for connection.')}

            });
        }

    })
    //listConnectionNames(oauth2Client.setCredentials(oauth2Client));
});

app.listen(app.get('port'), () => {
    console.log(`Server is running on http://${app.get('host')}:${app.get('port')}`);
});



