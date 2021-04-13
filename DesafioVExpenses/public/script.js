//const { on } = require("node:events");

const URI = '/api/agenda';

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    $('#loadContacts').on('click', function () {
        $.ajax({
            url: URI,
            success: function (contacts) {
                let tbody = $('tbody');
                tbody.html('');
                //console.log("chatText:")
                //console.log(chatText);
                contacts.forEach(contact => {
                    tbody.append(`
                  <tr>
                    <td class = "name">${contact.name}</td>
                    <td class = "text">${contact.phone}</td>
                  </tr>`)
                })
            }
        });
    })

});



