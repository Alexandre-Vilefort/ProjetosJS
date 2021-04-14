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
        <div class="contactForm card col-lg-4">
            <div class="card-body">
                <form id="newContactForm" action="/api/novoCadastro" method="post" >
                    <label for="newNameInp">Nome</label>
                    <input  type="text" name="name" class="form-control" id="newNameInp" placeholder="Nome">
                    <br>
                    <label for="newEmailInp">Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" placeholder="Email">
                    <br>

                    <label for="newPhoneInp">Fone</label>
                        <div class="btn-group btn-group-toggle">
                            <button class="btn btn-dark btn-sm ml-4" id="addPhoneBtn">+</button>
                            <button class="btn btn-dark btn-sm ml-4" id="rmvPhoneBtn">-</button>
                        </div>  
                    <input  type="tel" name="phone" class="form-control" id="newPhoneInp" placeholder="Phone">
                    <div id="divPhone">
                    </div>
                    <br>
                    <button type="submit" class="form-control btn btn-dark" id="btnSalvar">Salvar</button>
                </form>
            </div>
        </div>`);

        //criar botão para gerar novas entradas para telefone
        let count = 2;
        $('#rmvPhoneBtn').on('click', function (e) {
            e.preventDefault();
            console.log("- apertou");
            let divPhone = $("#divPhone").html();
            console.log(divPhone);
            let arDivPhone = divPhone.split("<br>");
            console.log(arDivPhone);
            let sizeVector = arDivPhone.length - 1
            console.log(sizeVector);
            arDivPhone.splice(sizeVector);
            let strDivPhone = arDivPhone.join("<br>");
            if (sizeVector>=1) {
                $("#divPhone").html(strDivPhone);
                count--; 
            }

            
        });
        $('#addPhoneBtn').on('click', function (e) {
            e.preventDefault();
            console.log("+ apertou");
            let divPhone = $("#divPhone");
            let newPhoneInput =`<br><label for="newPhoneInp2">Fone ${count}</label>
                                    <input  type="tel" name="phone" class="form-control" id="newPhoneInp2" placeholder="Phone">`
            divPhone.append(newPhoneInput);
            count++;
        });
        
        //Customizar o submit do forms
        $('#btnSalvar').on('click', function (e) {
            e.preventDefault();
            console.log("apertou");
            $.ajax({
                url: URI + "/novoCadastro",
                method: 'POST',
                data: $('#newContactForm').serialize(),// method creates a text string in standard URL-encoded notation
                success: function (res) {
                    $('#loadContacts').click();
                    console.log("Sucesso Post");
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    });
});

//Back-end
// function btnSalvar1() {
//     console.log("submit");
//     $('#loadContacts').click();

// }

// function submitContactForm(e) {
//     console.log("nada")
// }

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
                    let phone = contact.phone;
                    if (Array.isArray(phone)) phone = phone[0];
                    container.append(`
                    <div class="col-lg-6 mb-3">
                        <div class="card"><div class="card-body"><table>
                        <tr>
                            <td><div class="profileImage">${contact.name[0]}</div></td>
                            <td><h4 class="card-title">${contact.name}</h4></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><div class="card-text">${phone}</div></td>
                        </tr>
                        <tr><td></td><td><div class="card-text">${contact.email}</div></td></tr>
                        </table></div><i class="fas fa-edit fa-2x text-right"></i></div>
                    </div>
                  `)
                })
            }
        });
    });
});

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
