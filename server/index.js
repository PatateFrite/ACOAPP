
const server=require('./imports/server');
const app = server.app
const express = server.express

const bodyParser = require('body-parser');
const compression = require('compression');

const cors = require('cors');

const api = require('./imports/api');
const auth = require('./imports/auth');

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

	.get('/flightinfo/:id', auth.authenticate, api.flightInfo)













