const io = require('socket.io')(3000)

console.log("server on");

io.on('connection', socket => {
    socket.emit('chat-message', 'Hello Wolrd')
})