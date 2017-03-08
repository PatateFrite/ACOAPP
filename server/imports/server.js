const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3000;

io.on('connection', (socket) => {
	console.log('a user connected');
});

server.listen(port, () => {
	console.log("App listening and serving on port " + port)
})

module.exports = {
	express,
	app,
	io
}