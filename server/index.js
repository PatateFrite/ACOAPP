const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
// const request = require('request');
const compression = require('compression');
// var io = require('socket.io')(server);
const cors = require('cors');

const api = require('./imports/api');
const auth = require('./imports/auth');

const port = 3000;


const siteDir = __dirname.replace('server','www');

app
	.use(compression()) // GZIP
	.use(cors())
	.use(express.static(siteDir))
	.use(express.static(siteDir + '/assets'))
	.use(bodyParser.json({ limit: '3mb' }))
	.use(bodyParser.urlencoded({ 'extended': true, limit: '3mb' }))

    .post('/login', auth.login)

    .post('/fourre'     , auth.authenticate, api.fourre.create)
    .get('/fourre/:id'  , auth.authenticate, api.fourre.get)
	.put('/fourre'      , auth.authenticate, api.fourre.update)
    .delete("/fourre/:id",auth.authenticate, api.fourre.delete)

/*io.on('connection', (socket) => {
	console.log('a user connected');
});*/

server.listen(port, () => {
	console.log("App listening on port " + port)
})













