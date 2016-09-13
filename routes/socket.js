var socket = require('socket.io-client')('http://localhost')
socket.on('connect', function() {
	console.log('connected')
})