
module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.emit('server event', {
      foo: 'bar'
    })
    socket.on('client event', function(data) {
      console.log(data)
    })
  })
}