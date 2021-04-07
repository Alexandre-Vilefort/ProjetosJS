//const socket = io('http://localhost:3000')

var socket = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});
socket.on('chat-message', data => {
    console.log(data);

})