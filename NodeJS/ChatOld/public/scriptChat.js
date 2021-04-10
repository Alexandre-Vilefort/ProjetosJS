const URI = '/api/chat';



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
        success: function(response) {
            textsend.val('');
            $('#getMessages').click();
        },
        error: function (err) {
          console.log(err);
        }
      });
});

setInterval(function(){ 
    $('#getMessages').click();  
}, 500);