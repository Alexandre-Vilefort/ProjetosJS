//const { on } = require("node:events");
const URI = '/api';

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

    $('#novoContato').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
        let container = $('#rowCards');
        container.html(`
        <div class="contact-form card col-lg-4">
            <div class="card-body">
                <form id="newContact-form" action="" >
                    <label for="newNameInp">Nome</label>
                    <input  type="text" name="name" class="form-control" id="newNameInp" placeholder="Nome">
                    <br>
                    <label for="newEmailInp">Emaio</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" placeholder="Email">
                    <br>
                    <label for="newPhoneInp">Emaio</label>
                    <input  type="number" name="phone" class="form-control" id="newPhoneInp" placeholder="Phone">
                    <br>
                    <button type="submit" class="form-control btn-dark" id="btnSaveNewContact">Salvar</button>
                </form>
            </div>
        </div>`);
    });
});

//Back-end
$(document).ready(function () {
    $('#loadContacts').on('click', function () {
        $.ajax({
            url: URI,
            success: function (contacts) {
                let container = $('#rowCards');
                container.html('');
                console.log("contacts:")
                console.log(contacts);
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
                        </table></div><i class="fas fa-edit fa-2x text-right"></i></div>
                    </div>
                  `)
                })
            }
        });
    });
});

function btnSalvar(){
    console.log("apertou");
    let newName = $('#newNameInp');
    let newEmail = $('#newEmailInp');
    let newPhone = $('#newPhoneInp');
    console.log(newName.val(),newPhone.val(),newEmail.val())
    $.ajax({
        url: URI,
        method: 'POST',
        data: {
            id: 7,
            name: newName.val(),
            phone: newPhone.val(),
            email: newEmail.val()
        },
        success: function (res) {
            $('#loadContacts').click();
        },
        error: function (err) {
            console.log(err);
        }
    });
}


{/* <div class="col-lg-6 mb-3">
    <div class="card"><div class="card-body"><table>
        <tr>
            <td><div class="profileImage">B</div></td>
            <td><h4 class="card-title">Contato 2</h4></td>
        </tr>
        <tr>
            <td></td>
            <td><div class="card-text">555-555</div></td>
        </tr>
    </table></div><i class="fas fa-edit text-right"></i></div>
</div> */}

//btnSaveNewContact

{/* <div class="contact-form card col-lg-4">
            <div class="card-body">
                <form id="newContact-form" >
                    <input  type="text" class="form-control" id="newNameInp" placeholder="Nome">
                    <br>
                    <input  type="text" class="form-control" id="newEmailInp" placeholder="Email">
                    <br>
                    <input  type="text" class="form-control" id="newPhoneInp" placeholder="Phone">
                    <br>
                    <button type="submit" class="form-control btn-dark" id="btnSaveNewContact">Salvar</button>
                </form>
            </div>
        </div> */}