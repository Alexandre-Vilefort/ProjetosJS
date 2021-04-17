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
        <div class="contactForm card col-lg-8">
            <div class="card-body">
                <form id="newContactForm" action="/api/novoCadastro" method="post" enctype="multipart/form-data">
                    <label for="newNameInp">Nome</label>
                    <input  type="text" name="name" class="form-control" id="newNameInp" placeholder="Nome">
                    <br>
                    <label for="newEmailInp"><i class="fas fa-at fa-lg mr-1"></i>Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" placeholder="Email">
                    <br>
                    <label for="inlineFormCustomSelect">Categorias</label>
                     <select name="categories"class="form-control custom-select" id="inlineFormCustomSelect">
                        <option selected></option>
                        <option value="família">Família</option>
                        <option value="trabalho">Trabalho</option>
                        <option value="amigos">Amigos</option>
                    </select>
                    <br>
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
                    <label for="newAddressInp"><strong>Endereço</strong></label>
                        <div class="btn-group btn-group-toggle">
                            <button class="btn btn-dark btn-sm ml-4" id="addAddressBtn">+</button>
                            <button class="btn btn-dark btn-sm ml-4" id="rmvAddressBtn">-</button>
                        </div>  
                    <br>
                    <br>
                    <div class="form-row">
                        <div class="form-group col-md-2">
                            <label for="newCEPInp">CEP</label>
                            <input  type="text" name="cep" class="form-control" id="newCEPInp" placeholder="CEP">
                        </div>
                        <div class="form-group col-md-8">
                            <label for="newStreetInp">Rua</label>
                            <input  type="text" name="street" class="form-control" id="newStreetInp" placeholder="Rua">
                        </div>
                        <div class="form-group col-md-2">
                            <label for="newHouseNumberInp">Número</label>
                            <input  type="number" name="number" class="form-control" id="newHouseNumberInp" placeholder="Número">
                        </div>
                    </div>
                    <br>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="newCompleInp">Complemento</label>
                            <input  type="text" name="complement" class="form-control" id="newStreetInp" placeholder="Complemento">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="newDistrictInp">Bairro</label>
                            <input  type="text" name="district" class="form-control" id="newDistrictInp" placeholder="Bairro">
                        </div>
                    </div>

                    <br>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="newDistricttInp">Cidade</label>
                            <input  type="text" name="city" class="form-control" id="newCityInp" placeholder="Cidade">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="newDistricttInp">Estado</label>
                            <input  type="text" name="state" class="form-control" id="newStateInp" placeholder="Estado">
                        </div>
                    </div>

                    <div id="divAddress">
                    </div>
                    <br>
                    <br>
                    <button type="submit" class="form-control btn btn-dark" id="btnSalvar">Salvar</button>
                </form>
                </div>
            </div>
        </div>`);

        //criar botão para gerar novas entradas para telefone
        let count = 2;
        let countAddress = 2;
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

        $('#rmvAddressBtn').on('click', function (e) {
            e.preventDefault();
            let divAddress = $("#divAddress").html();
            let arDivAddress = divAddress.split(`<br class="pularRmvBtn_">`);
            let sizeVector = arDivAddress.length - 1
            arDivAddress.splice(sizeVector);
            let strDivAddress = arDivAddress.join(`<br class="pularRmvBtn_">`);
            if (sizeVector >= 1) {
                $("#divAddress").html(strDivAddress);
                countAddress--;
            }
        });

        $('#addPhoneBtn').on('click', function (e) {
            e.preventDefault();
            addInputPhone(count)
            count++;
        });

        $('#addAddressBtn').on('click', function (e) {
            e.preventDefault();
            addInputAddress(countAddress)
            countAddress++;
        });

        //Customizar o submit do forms
        $('#btnSalvar').on('click', function (e) {
            e.preventDefault();
            console.log("apertou");
            let formsData = $("#newContactForm").serialize();// method creates a text string in standard URL-encoded notation
            let formsAddress = $("#newAddressForm").serialize();
            //let formsData =JSON.stringify($("#newContactForm").serialize());
            console.log(formsData);
            console.log(formsAddress);
            $.ajax({
                url: URI + "/novoCadastro",
                method: 'POST',
                data: formsData,
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
        loadCardContacts();
    });

    $('.filterTab').on('click', function () {
        let filter = $(this).text()
        $("#tituloH2").text(filter);
        loadCardContacts(filter);
    });
});

//--------#------Functions Declaration---------------------
function cardUpdate(contact) {
    console.log("Atualizar contato " + contact.name);
    $("#tituloH2").text('Contato ' + contact.id);
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
    //Remover input de telefone
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
    //Adicionar input de telefone
    $('#addPhoneBtn').on('click', function (e) {
        e.preventDefault();
        addInputPhone(count)
        count++;
    });

    //Botao Salvar    
    $('#btnSalvar').on('click', function (e) {
        e.preventDefault();
        //let dataForm = $('#newContactForm').serialize();
        $.ajax({
            url: URI + "/updateCadastro/" + contact.id,
            method: 'PUT',
            data: $('#newContactForm').serialize(),
            success: function (res) {
                $('#loadContacts').click();
                console.log("Sucesso Put");
            }
        });
    });
}


//carregar contatos no front
function loadCardContacts(filter) {
    $.ajax({
        url: URI,
        success: function (contacts) {
            let container = $('#rowCards');

            container.html('');
            if (filter) {
                contacts = contacts.filter(function (contact) {
                    return contact.categories.includes(filter.toLowerCase());
                });
            };
            let index = 0;
            contacts.forEach(contact => {
                let phone = contact.phone;
                index++;
                contact.id = index;
                if (Array.isArray(phone)) phone = phone[0];
                container.append(`
                    <div class="card col-lg-6 m-3" id="card${contact.id}">
                    <div class="card-body">
                    <div class="d-sm-flex rounded trans" id="divName${contact.id}">
                        <div class="profileImage">${contact.name[0]}</div>
                        <h4 class="card-title ml-2">${contact.name}</h4>
                        <i class="fas fa-edit fa-lg ml-auto p-2" id="iconContact${contact.id}"></i>
                    </div>
                    <div class="d-sm-flex justify-content-sm-center flex-sm-wrap trans" id="conteinerCont${contact.id}">
                        <div class="card-text"><i class="fas fa-phone-alt fa-lg mr-3"></i>${phone}</div>
                    </div>
                    <div class="d-sm-flex justify-content-sm-center rounded trans" id="divEmail${contact.id}">
                        
                        <div class="card-text p-2 "><i class="fas fa-at fa-lg mr-1"></i>${contact.email}</div>
                        
                    </div>

                    <div class="class="d-sm-flex justify-content-sm-center flex-sm-wrap rounded trans" id="divAddress${contact.id}">
                    </div>

                    </div>
                    </div>
                `)
                $(`#card${contact.id}`).on('click', function () { cardExpand(contact) });
                $(`#iconContact${contact.id}`).on('click', function () { cardUpdate(contact) });
            });
        }
    });
}

//Adicionar input para telefone, usado no novo contato e atualizar contato

//Expandir card com informações dos contatos
function cardExpand(contact) {
    console.log("contact name: " + contact.name);
    let tdCont = $(`#conteinerCont${contact.id}`);
    let tdAddress = $(`#divAddress${contact.id}`);
    tdCont.html('');
    tdAddress.html('');

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

            let test = "";
            for (let i = 0; i < contact.address.length; i++) {
                for (let proper in contact.address[i]){test = test + contact.address[i][proper].toString()};
                if (test) {
                tdAddress.append(`
                   <br> 
                  <div class="bg-corp rounded p-1 mt-2 trans"><i class="fas fa-map-marker-alt"></i><strong> ${i + 1}</strong><br>
                  `)
                for (let proper in contact.address[i]){
                    if(contact.address[i][proper]) tdAddress.append(`<strong>${proper}:</strong>  ${contact.address[i][proper]} `)
                }  
                tdAddress.append(`  </div>`);               
            }
        }
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

function addInputPhone(count) {
    let divPhone = $("#divPhone");
    let newPhoneInput = `<br><label for="newPhoneInp${count}"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone ${count}</label>
                                    <input  type="tel" name="phone" class="form-control" id="newPhoneInp${count}" placeholder="Phone">`
    divPhone.append(newPhoneInput);
}

function addInputAddress(count) {
    let divAddress = $("#divAddress");
    let newAddressInput = `<br class="pularRmvBtn_">

    <label for="newAddressInp"><strong>Endereço ${count}</strong></label>
    <br>
    <br>
    <div class="form-row">
        <div class="form-group col-md-2">
            <label for="newCEPInp${count}">CEP</label>
            <input  type="text" name="cep" class="form-control" id="newCEPInp${count}" placeholder="CEP">
        </div>
        <div class="form-group col-md-8">
            <label for="newStreetInp${count}">Rua</label>
            <input  type="text" name="street" class="form-control" id="newStreetInp${count}" placeholder="Rua">
        </div>
        <div class="form-group col-md-2">
            <label for="newHouseNumberInp${count}">Número</label>
            <input  type="number" name="number" class="form-control" id="newHouseNumberInp" placeholder="Número">
        </div>
    </div>
    
    <br>

    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="newCompleInp${count}">Complemento</label>
            <input  type="text" name="complement" class="form-control" id="newStreetInp${count}" placeholder="Complemento">
        </div>
        <div class="form-group col-md-6">
            <label for="newDistrictInp${count}">Bairro</label>
            <input  type="text" name="district" class="form-control" id="newDistrictInp${count}" placeholder="Bairro">
        </div>
    </div>

    <br>
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="newDistricttInp${count}">Cidade</label>
            <input  type="text" name="city" class="form-control" id="newCityInp${count}" placeholder="Cidade">
        </div>
        <div class="form-group col-md-6">
            <label for="newDistricttInp${count}">Estado</label>
            <input  type="text" name="state" class="form-control" id="newStateInp${count}" placeholder="Estado">
        </div>
    </div>`;

    divAddress.append(newAddressInput);
}