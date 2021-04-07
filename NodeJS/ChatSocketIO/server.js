var io = require('socket.io')(3000);

// const io = require('socket.io')(strapi.server, {
//     cors: {
//       origin: "http://localhost:3000",
//       credentials: true
//     }
//   });

console.log("server on")

io.on('connection', socket => {
    socket.emit('chat-message', 'Hello Wolrd')
})