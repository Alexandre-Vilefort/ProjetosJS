//const { on } = require("node:events");
const URI = '/api/agenda';

// funcionamento do front
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
});

//Back-end
$(document).ready(function () {
    $('#loadContacts').on('click', function () {
        $.ajax({
            url: URI,
            success: function (contacts) {
                let container = $('#containerCards');
                container.html('');
                //console.log("contacts:")
                //console.log(contacts);
                contacts.forEach(contact => {
                    container.append(`
                    <div class="col-lg-6 mb-3">
                        <div class="card"><div class="card-body"><table>
                        <tr>
                            <td><div class="profileImage">B</div></td>
                            <td><h4 class="card-title">${contact.name}</h4></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><div class="card-text">${contact.phone}</div></td>
                        </tr>
                        </table></div></div>
                    </div>
                  `)
                })
            }
        });
    });
});


/* <div class="col-lg-6 mb-3">
    <div class="card"><div class="card-body"><table>
        <tr>
            <td><div class="profileImage">B</div></td>
            <td><h4 class="card-title">Contato 2</h4></td>
        </tr>
        <tr>
            <td></td>
            <td><div class="card-text">555-555</div></td>
        </tr>
    </table></div></div>
</div> */