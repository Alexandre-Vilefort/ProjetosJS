const URI = '/api/chat';

const events = new EventSource('http://localhost:8000/api/chat/connect');
events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    console.log(parsedData,'SSE funcionou');
    $('#testeSSE').html('SSE deu certo');
    $('#getMessages').click();
}

$('#getMessages').on('click', () => {
    $.ajax({
        url: URI,
        success: function (chatText) {
            let tbody = $('tbody');
            tbody.html('');
            //console.log("chatText:")
            //console.log(chatText);
            chatText.forEach(chat => {
                tbody.append(`
              <tr>
                <td class = "name">${chat.name}</td>
                <td class = "text">${chat.text}</td>
              </tr>
          `)
            })
        }
    });
});

$('#messagesForm').on('submit', (e) => {
    e.preventDefault();
    let textsend = $('#newMessage');
    let namesend = $('#nameUser');
    $.ajax({
        url: URI,
        method: 'POST',
        data: {
            name: namesend.val(),
            text: textsend.val()
        },
        success: function (response) {
            textsend.val('');
            $('#getMessages').click();
        },
        error: function (err) {
            console.log(err);
        }
    });
});

setInterval(function () {
    $('#getMessages').click();
}, 50000);