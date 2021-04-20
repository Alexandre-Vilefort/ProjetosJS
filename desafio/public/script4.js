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
                    <input  type="text" name="name" class="form-control" id="newNameInp" placeholder="Nome" required>
                    <br>
                    <label for="newEmailInp"><i class="fas fa-at fa-lg mr-1"></i>Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" placeholder="Email">

                    <br>
                    <label for="inlineFormCustomSelect">Categorias</label>
                     <select name="categories"class="form-control custom-select" id="inlineFormCustomSelect" multiple>
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
                    <input  type="number" name="phone" class="form-control" id="newPhoneInp" placeholder="Phone">
                    <div id="divPhone">
                    </div>
                    <br>
                    <label for="newAddressInp"><strong>Endereço 1</strong></label>
                        <div class="btn-group btn-group-toggle">
                            <button class="btn btn-dark btn-sm ml-4" id="addAddressBtn">+</button>
                        <!--<button class="btn btn-dark btn-sm ml-4" id="rmvAddressBtn">-</button>-->
                        </div>  
                    <br>
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

        addInputAddress(1);

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
            let divAddress = $("#divAddress");
            let newAddressInput = `<br class="pularRmvBtn_">
            <label for="newAddressInp"><strong>Endereço ${countAddress}</strong></label>`
            divAddress.append(newAddressInput);
            addInputAddress(countAddress)
            countAddress++;
        });

        //Customizar o submit do forms
        $('#btnSalvar').on('click', function (e) {
            e.preventDefault();
            console.log("apertou");
            let formsData = $("#newContactForm").serialize();// method creates a text string in standard URL-encoded notation
            console.log(formsData);
            if (formValidation($('#newContactForm'))) {
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
            }
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

    $('#btnSearch').on('click', function () {
        let contactName = $("#searchContacts").val();
        console.log(contactName);
        loadCardContacts("", contactName);
    });
});

//--------#------Functions Declaration---------------------
function cardUpdate(contact) {
    console.log("Atualizar contato " + contact.name);
    $("#tituloH2").text('Contato ' + contact.id);
    let container = $('#rowCards');
    let phone = contact.phone;
    if (Array.isArray(phone)) phone = phone[0];
    if (!(contact.categories)) contact.categories = '';
    container.html(`
        <div class="contactForm card col-lg-8">
            <div class="card-body">
                <form id="newContactForm" action="/api/updateCadastro" method="put" >
                    <label for="newNameInp">Nome</label>
                    <input  type="text" name="name" class="form-control" id="newNameInp" value="${contact.name}" required>
                    <br>
                    <label for="newEmailInp"><i class="fas fa-at fa-lg mr-1"></i>Email</label>
                    <input  type="email" name="email" class="form-control" id="newEmailInp" value="${contact.email}">
                    
                    <br>
                    <label for="inlineFormCustomSelect">Categorias</label>
                     <select name="categories"class="form-control custom-select" id="inlineFormCustomSelect" multiple>
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
                    <input  type="number" name="phone" class="form-control" id="newPhoneInp" value="${phone}">
                    <div id="divPhone">
                    </div>
                    <br>
                    <label for="newAddressInp"><strong>Endereço 1</strong></label>
                        <div class="btn-group btn-group-toggle">
                            <button class="btn btn-dark btn-sm ml-4" id="addAddressBtn">+</button>
                            <!--<button class="btn btn-dark btn-sm ml-4" id="rmvAddressBtn">-</button>-->
                        </div>  
                    <br>
                    <div id="divAddress">
                        <div id="divAddress1"></div>
                    </div>
                    <br>
                    <br>
                    <button type="submit" class="form-control btn btn-dark" id="btnSalvar">Salvar</button>
                </form>
            </div>
        </div>`);

    let count = 1;
    let countAddress = 1;

    console.log(contact.address[0]);
    addInputAddress(1, contact.address[0]);

    if (contact.address.length > 1) {
        for (let i = 1; i < contact.address.length; i++) {
            countAddress++;
            let divAddress = $("#divAddress");

            let newAddressInput = `<br class="pularRmvBtn_">
            <label for="newAddressInp"><strong>Endereço ${countAddress}</strong></label>`
            divAddress.append(newAddressInput);
            addInputAddress(countAddress, contact.address[i])

        }
    }

    if (Array.isArray(contact.phone)) {
        let tdCont = $(`#divPhone`);
        for (let p = 1; p < contact.phone.length; p++) {
            count++;
            tdCont.append(`<br><label for="newPhoneInp${count}"><i class="fas fa-phone-alt fa-lg mr-3"></i>Fone ${count}</label>
                               <input  type="number" name="phone" class="form-control" id="newPhoneInp${count}" value="${contact.phone[p]}">`);
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

    //Adicionar input de telefone
    $('#addPhoneBtn').on('click', function (e) {
        e.preventDefault();
        count++;
        addInputPhone(count)
    });

    $('#addAddressBtn').on('click', function (e) {
        e.preventDefault();
        countAddress++;
        let divAddress = $("#divAddress");
        let newAddressInput = `<br class="pularRmvBtn_">
        <label for="newAddressInp"><strong>Endereço ${countAddress}</strong></label>`
        divAddress.append(newAddressInput);
        addInputAddress(countAddress,'')
    });

    //Botao Salvar    
    $('#btnSalvar').on('click', function (e) {
        e.preventDefault();
        //let dataForm = $('#newContactForm').serialize();
        if (formValidation($('#newContactForm'))) {
            $.ajax({
                url: URI + "/updateCadastro/" + contact.id,
                method: 'PUT',
                data: $('#newContactForm').serialize(),
                success: function (res) {
                    $('#loadContacts').click();
                    console.log("Sucesso Put");
                }
            });
        }
    });
}


//carregar contatos no front
function loadCardContacts(filterCat, filterName) {
    $.ajax({
        url: URI,
        success: function (contacts) {
            //Container Contacts Cards
            let container = $('#rowCards');
            //Search Bar
            let searchData = $('#searchContactsList');

            container.html('');
            if (filterCat) {
                contacts = contacts.filter(function (contact) {
                    return contact.categories.includes(filterCat.toLowerCase());
                });
            };
            if (filterName) {
                console.log("entrou filtro de nome")
                contacts = contacts.filter(function (contact) {
                    return contact.name == filterName;
                });
            };
            let index = 0;
            searchData.html('');
            contacts.forEach(contact => {
                searchData.append(`<option value="${contact.name}"></option>`)
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
                    <div class="d-sm-flex justify-content-sm-center mt-1" id="divCat${contact.id}">
                    </div>
                    <div class="class="d-sm-flex justify-content-sm-center flex-sm-wrap rounded trans" id="divAddress${contact.id}">
                    </div>

                    <div id="btnDel${contact.id}" class="text-right">
                    <div>

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
    let tdCat = $(`#divCat${contact.id}`);
    let tdDel = $(`#btnDel${contact.id}`);

    tdCont.html('');
    tdAddress.html('');
    tdCat.html('');
    tdDel.html('');

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

        tdCat.html(`${contact.categories}`)

        let test = "";
        for (let i = 0; i < contact.address.length; i++) {
            for (let proper in contact.address[i]) { test = test + contact.address[i][proper].toString() };
            if (test) {
                tdAddress.append(`
                   <br> 
                  <div class="bg-corp rounded p-1 mt-2 trans"><i class="fas fa-map-marker-alt"></i><strong> ${i + 1}</strong><br>
                  `)
                for (let proper in contact.address[i]) {
                    if (contact.address[i][proper]) tdAddress.append(`<strong>${proper}:</strong>  ${contact.address[i][proper]} `)
                }
                tdAddress.append(`  </div>`);
            }
        }
        tdDel.html(`<i class="fas fa-times fa-lg ml-auto p-2" id="iconDel${contact.id}"></i>`);

        $(`#iconDel${contact.id}`).on('click', function () {
            //delete
            let id = contact.id;//Para id ser a posicão do contato no array
            $.ajax({
                url: `${URI}/${id}`,
                method: 'DELETE',
                success: function (response) {
                    $('#loadContacts').click();
                    console.log("Sucesso: Contato deletado");
                },
                error: function (err) {
                    console.log(err);
                    console.log("Falha em deletar contato");
                }
            });
        });



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
                                    <input  type="number" name="phone" class="form-control" id="newPhoneInp${count}" placeholder="Phone">`
    divPhone.append(newPhoneInput);
}

function addInputAddress(count, data) {
    let divAddress = $("#divAddress");
    let newAddress;
    if (data) {
        newAddress = data;
    } else {
        newAddress = new Object();
        // Object.keys(newAddress).forEach(function(index) {
        //     newAddress[index] = '';
        // });
        newAddress.cep = "";
        newAddress.Logradouro = "";
        newAddress.Número = "";
        newAddress.Complemento = "";
        newAddress.Bairro = "";
        newAddress.Localidade = "";
        newAddress.Estado = "";
    }

    let newAddressInput = `
    
    <button type="button" class="btn btn-dark m-3" id="btnBuscaCEP${count}">Buscar pelo CEP</button>
    <br>
    <div class="form-row">
        <div class="form-group col-md-2">
            <label for="newCEPInp${count}">CEP</label>
            <input  type="text" name="cep" class="form-control cepInp" id="newCEPInp${count}" placeholder="CEP" value="${newAddress.cep}">
        </div>
        <div class="form-group col-md-8">
            <label for="newStreetInp${count}">Logradouro</label>
            <input  type="text" name="street" class="form-control" id="newStreetInp${count}" placeholder="Rua" vvalue="${newAddress.Logradouro}">
        </div>
        <div class="form-group col-md-2">
            <label for="newHouseNumberInp${count}">Número</label>
            <input  type="number" name="number" class="form-control" id="newHouseNumberInp${count}" placeholder="Número" value="${newAddress.Número}">
        </div>
    </div>
    
    <br>

    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="newCompleInp${count}">Complemento</label>
            <input  type="text" name="complement" class="form-control" id="newCompleInp${count}" placeholder="Complemento" value="${newAddress.Complemento}">
        </div>
        <div class="form-group col-md-6">
            <label for="newDistrictInp${count}">Bairro</label>
            <input  type="text" name="district" class="form-control" id="newDistrictInp${count}" placeholder="Bairro" value="${newAddress.Bairro}">
        </div>
    </div>

    <br>
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="newDistricttInp${count}">Cidade</label>
            <input  type="text" name="city" class="form-control" id="newCityInp${count}" placeholder="Cidade" value="${newAddress.Localidade}">
        </div>
        <div class="form-group col-md-6">
            <label for="newDistricttInp${count}">Estado</label>
            <input  type="text" name="state" class="form-control" id="newStateInp${count}" placeholder="Estado" value="${newAddress.Estado}">
        </div>
    </div>`;

    divAddress.append(newAddressInput);
    $(`#btnBuscaCEP${count}`).on('click', function () {
        let cep = $(`#newCEPInp${count}`).val();
        cep = cep.replace(/\D/g, '');
        var validaCEP = /^[0-9]{8}$/; // Regular Expression
        if (validaCEP.test(cep)) {
            $.ajax({
                url: `https://viacep.com.br/ws/${cep}/json`,//Usando viacep.com.br para buscar endereço pelo CEP
                success: function (conteudo) {
                    console.log(conteudo);
                    if (!("erro" in conteudo)) {
                        //Atualiza os campos com os valores.
                        $(`#newStreetInp${count}`).val(conteudo.logradouro);
                        $(`#newCompleInp${count}`).val(conteudo.complemento);
                        $(`#newDistrictInp${count}`).val(conteudo.bairro);
                        $(`#newCityInp${count}`).val(conteudo.localidade);
                        $(`#newStateInp${count}`).val(conteudo.uf);
                    } //end if.
                    else {
                        //CEP não Encontrado.
                        alert("CEP não encontrado.");
                        $(`#newCEPInp${count}`).val('');
                    }
                },
            });
        } else { alert("CEP Invalido") }
    });
}

function formValidation(forms) {
    test = true
    if ($('#newNameInp').val()) {
        $('#newNameInp').addClass('is-valid')
        $('#newNameInp').removeClass('is-invalid')
    } else {
        $('#newNameInp').removeClass('is-valid')
        $('#newNameInp').addClass('is-invalid')
        test = false
    }
    var validaCEP = /^[0-9]{8}$/;
    listCep = $('.cepInp');

    for (let i = 0; i < listCep.length; i++) {
        let cep = listCep.eq(i).val();
        cep = cep.replace(/\D/g, '');

        if (!(!(cep) || validaCEP.test(cep))) {
            test = false
            listCep.eq(i).addClass('is-invalid');
        } else { listCep.eq(i).removeClass('is-invalid') }
    }
    return test;
}