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
            let arDivPhone = divPhone.split("<br>");
            let sizeVector = arDivPhone.length - 1
            arDivPhone.splice(sizeVector);
            let strDivPhone = arDivPhone.join("<br>");
            if (sizeVector >= 1) {
                $("#divPhone").html(strDivPhone);
                count--;
            }
        });
        $('#addPhoneBtn').on('click', function (e) {
            e.preventDefault();
            console.log("+ apertou");
            let divPhone = $("#divPhone");
            let newPhoneInput = `<br><label for="newPhoneInp2">Fone ${count}</label>
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
                        
                        <div class="card col-lg-5 m-3" id="card${contact.id}">
                        <div class="card-body">
                        <div class="d-sm-flex flex-sm-row">
                            <div class="profileImage">${contact.name[0]}</div>
                            <h4 class="card-title">${contact.name}</h4>
                        </div>
                        <div class="d-sm-flex justify-content-sm-center" id="conteinerCont${contact.id}">
                            <td id="conteinerCont${contact.id}"><div class="card-text">Fone: ${phone}</div>
                        </div>
                        <div class="d-sm-flex justify-content-sm-center">
                            <div class="card-text p-3">${contact.email}</div>
                        </div>
                        </div>
                        </div>
                    `)

                    $(`#card${contact.id}`).on('click', function () {
                        console.log("contact name: " + contact.name);
                        
                        let divCard = $(`#card${contact.id}`);
                        if ($(`#card${contact.id}`).hasClass("col-lg-5")) {
                            $(`#card${contact.id}`).toggleClass("col-lg-5");
                            $(`#card${contact.id}`).toggleClass("col-lg-10");
                            divCard.html(`
                            <div class="card-body">
                            <div class="d-sm-flex flex-sm-row p-3 bg-corp rounded trans">
                                <div class="profileImage">${contact.name[0]}</div>
                             <div class="p-2"><h4 class="card-title">${contact.name}</h4></div>
                            </div>
                                <div class="d-lg-flex flex-lg-row-reverse flex-lg-wrap" id="conteinerCont${contact.id}">
                            </div>
                            <div class="d-lg-flex flex-lg-row bg-corp rounded trans">
                               <div class="card-text p-3">${contact.email}</div>
                            </div>
                            </div><i class="fas fa-edit fa-2x text-right m-2" id="iconContact${contact.id}"></i>
                            `);
                            let tdCont = $(`#conteinerCont${contact.id}`);
                            tdCont.html('');
                            if (Array.isArray(contact.phone)) {
                                for (let p = contact.phone.length - 1; p >= 0; p--) {
                                    tdCont.append(`<div class="p-3">Fone ${p+1} <br> ${contact.phone[p]} </div>`);
                                }
                            }else{
                                tdCont.append(`<div class="p-3">Fone <br> ${contact.phone} </div>`);
                            }
                        }else if ($(`#card${contact.id}`).hasClass("col-lg-10")){
                            $(`#card${contact.id}`).toggleClass("col-lg-10");
                            $(`#card${contact.id}`).toggleClass("col-lg-5");
                            let phone1 = contact.phone;
                            if (Array.isArray(phone1)) phone1 = phone1[0];
                            divCard.html(`
                            <div class="card-body">
                            <div class="d-sm-flex flex-sm-row">
                                <div class="profileImage">${contact.name[0]}</div>
                                <h4 class="card-title">${contact.name}</h4>
                            </div>
                            <div class="d-sm-flex justify-content-sm-center" id="conteinerCont${contact.id}">
                                <td id="conteinerCont${contact.id}"><div class="card-text">Fone: ${phone1}</div>
                            </div>
                            <div class="d-sm-flex justify-content-sm-center">
                                <div class="card-text p-2">${contact.email}</div>
                            </div>
                            </div>
                            `);
                        };
                    });
                });
            }
        });
    });
});


{/* <div>----------------</div>    

<div class="card-body">
<table>
<tr>
    <td><div class="profileImage">${contact.name[0]}</div></td>
    <td><h4 class="card-title">${contact.name}</h4></td>
</tr>
<tr>
    <td></td>
    <td id="conteinerCont${contact.id}" class="d-lg-flex">
    </td>
</tr>
</table></div><i class="fas fa-edit fa-2x text-right invisible" id="iconContact${contact.id}"></i> */}

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
