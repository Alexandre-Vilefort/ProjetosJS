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
    // funcionamento Tela de novo contatos
    $('#novoContato').on('click', function () {
        $("#tituloH2").text('Novo Contato');
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
                    <label for="newEmailInp"><i class="fas fa-at fa-lg mr-1"></i>Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" placeholder="Email">
                    <br>

                    <label for="newPhoneInp"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone</label>
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
            addInputPhone(count)
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
        $("#tituloH2").text('Todos Contatos');
        $.ajax({
            url: URI,
            success: function (contacts) {
                let container = $('#rowCards');
                container.html('');
                contacts.forEach(contact => {
                    let phone = contact.phone;
                    if (Array.isArray(phone)) phone = phone[0];
                    container.append(`
                        <div class="card col-lg-6 m-3" id="card${contact.id}">
                        <div class="card-body">
                        <div class="d-sm-flex flex-sm-row rounded trans" id="divName${contact.id}">
                            <div class="profileImage">${contact.name[0]}</div>
                            <h4 class="card-title ml-2">${contact.name}</h4>
                        </div>
                        <div class="d-sm-flex justify-content-sm-center flex-sm-wrap trans" id="conteinerCont${contact.id}">
                            <div class="card-text"><i class="fas fa-phone-alt fa-lg mr-3"></i>${phone}</div>
                        </div>
                        <div class="d-sm-flex justify-content-sm-between rounded trans" id="divEmail${contact.id}">
                            <i class="fas fa-at fa-lg invisible" ></i>
                            <div class="card-text p-2 "><i class="fas fa-at fa-lg mr-1"></i>${contact.email}</div>
                            <i class="fas fa-edit fa-lg text-right" id="iconContact${contact.id}"></i>
                        </div>
                        </div>
                        </div>
                    `)
                    $(`#card${contact.id}`).on('click', function () { cardExpand(contact) });
                    $(`#iconContact${contact.id}`).on('click', function () { cardUpdate(contact) });

                });
            }
        });
    });
});

function cardUpdate(contact) {
    console.log("Atualizar contato " + contact.name);
    $("#tituloH2").text('Atualizar Contato ' + contact.id);
    let container = $('#rowCards');
    let phone = contact.phone;
    if (Array.isArray(phone)) phone = phone[0];
    container.html(`
        <div class="contactForm card col-lg-4">
            <div class="card-body">
                <form id="newContactForm" action="/api/updateCadastro" method="put" >
                    <label for="newNameInp">Nome</label>
                    <input  type="text" name="name" class="form-control" id="newNameInp" value="${contact.name}">
                    <br>
                    <label for="newEmailInp"><i class="fas fa-at fa-lg mr-1"></i>Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" value="${contact.email}">
                    <br>
                    <label for="newPhoneInp"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone</label>
                        <div class="btn-group btn-group-toggle">
                            <button class="btn btn-dark btn-sm ml-4" id="addPhoneBtn">+</button>
                            <button class="btn btn-dark btn-sm ml-4" id="rmvPhoneBtn">-</button>
                        </div>        
                    <input  type="tel" name="phone" class="form-control" id="newPhoneInp" value="${phone}">
                    <div id="divPhone">
                    </div>
                    <br>
                    <button type="submit" class="form-control btn btn-dark" id="btnSalvar">Salvar</button>
                </form>
            </div>
        </div>`);
    let tdCont = $(`#divPhone`);
    let count = 1;
    if (Array.isArray(contact.phone)) {
        for (let p = 1; p < contact.phone.length; p++) {
            count++;
            tdCont.append(`<br><label for="newPhoneInp2"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone ${count}</label>
                               <input  type="tel" name="phone" class="form-control" id="newPhoneInp2" value="${contact.phone[p]}">`);
        }
    }
    //evento para remover input de telefone
    $('#rmvPhoneBtn').on('click', function (e) {
        e.preventDefault();
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
    //Evento para adicionar input de telefone
    $('#addPhoneBtn').on('click', function (e) {
        e.preventDefault();
        addInputPhone(count)
        count++;
    });

    //Botao Salvar    
    $('#btnSalvar').on('click', function (e) {
        e.preventDefault();
        let dataForm = $('#newContactForm').serialize();
        $.ajax({
            url: URI + "/updateCadastro/"+contact.id,
            method: 'PUT',
            data: $('#newContactForm').serialize(),
            success: function (res) {
                $('#loadContacts').click();
                console.log("Sucesso Put");
            }
        });
    });
}

//--------#------Funções---------------------

//Adicionar input para telefone, usado no novo contato e atualizar contato
function addInputPhone(count) {
    let divPhone = $("#divPhone");
    let newPhoneInput = `<br><label for="newPhoneInp2"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone ${count}</label>
                                    <input  type="tel" name="phone" class="form-control" id="newPhoneInp2" placeholder="Phone">`
    divPhone.append(newPhoneInput);
}
//Expandir card com informações dos contatos
function cardExpand(contact) {
    console.log("contact name: " + contact.name);
    let tdCont = $(`#conteinerCont${contact.id}`);
    tdCont.html('');

    if ($(`#card${contact.id}`).hasClass("col-lg-6")) {//Experimentar col-lg-5 para ficar dois em cada linha
        $(`#card${contact.id}`).toggleClass("col-lg-6");
        $(`#card${contact.id}`).toggleClass("col-lg-10");
        $(`#divName${contact.id}`).toggleClass("bg-corp p-3");
        $(`#divEmail${contact.id}`).toggleClass("bg-corp p-1");

        if (Array.isArray(contact.phone)) {
            for (let p = 0; p < contact.phone.length; p++) {
                tdCont.append(`<div class="p-3"><i class="fas fa-phone-alt fa-lg mr-1"></i> <strong>${p + 1}</strong> <br> ${contact.phone[p]} </div>`);
            }
        } else { tdCont.append(`<div class="p-3"><i class="fas fa-phone-alt fa-lg mr-3"></i> ${contact.phone} </div>`) };

    } else if ($(`#card${contact.id}`).hasClass("col-lg-10")) {
        $(`#card${contact.id}`).toggleClass("col-lg-10");
        $(`#card${contact.id}`).toggleClass("col-lg-6");
        $(`#divName${contact.id}`).toggleClass("bg-corp p-3");
        $(`#divEmail${contact.id}`).toggleClass("bg-corp p-1");

        let phone1 = contact.phone;
        if (Array.isArray(phone1)) phone1 = phone1[0];
        tdCont.html(`<div class="card-text"><i class="fas fa-phone-alt fa-lg mr-3"></i>${phone1}</div>`);
    };
}


