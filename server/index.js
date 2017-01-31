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

app
	.use(compression()) // GZIP
	.use(cors())
	.use(express.static(__dirname))
	.use(express.static(__dirname + '/assets'))
	.use(bodyParser.json({ limit: '3mb' }))
	.use(bodyParser.urlencoded({ 'extended': true, limit: '3mb' }))

    .post('/login', auth.login)

    .get('/fourre'       , auth.authenticate, api.fourre.create)
    .get('/fourres/:id'  , auth.authenticate, api.fourre.get)
	.post("/fourre"      , auth.authenticate, api.fourre.update)
    .delete("/fourres/:id",auth.authenticate, api.fourre.delete)

/*io.on('connection', (socket) => {
	console.log('a user connected');
});*/

server.listen(port, () => {
	console.log("App listening on port " + port)
})













