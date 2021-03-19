var selectedFile;
var jsonObject;
var dataQuest;
var number;// número da questão
var question;// array com asquestões em string
var answer;// array com as respostas
var setAnswer;// set com as respostas, unico
var answerCounter;// array com o número de cada resposta
var checkList; 

document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
        
        
        (function ($) {
            var windowWidth = $(window).width();
            if (windowWidth < 1010) {
                $('body').removeClass('open');
                if (windowWidth < 760) {
                    $('#left-panel').slideToggle();
                } else {
                    $('#left-panel').toggleClass('open-menu');
                }
            } else {
                $('body').toggleClass('open');
                $('#left-panel').removeClass('open-menu');
            }
        }(jQuery));

        document.getElementById('facaUpload').innerHTML = "";//Escrever alguma coisa aqui

        selectedFile = event.target.files[0];
        if (selectedFile) {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var data = event.target.result;

                var workbook = XLSX.read(data, {
                    type: "binary"
                });
                workbook.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(
                        workbook.Sheets[sheet]
                    );
                    jsonObject = JSON.stringify(rowObject);
                    dataQuest = JSON.parse(jsonObject);
                    console.log("hi");

                });
                createDataVar();
            };
            fileReader.readAsBinaryString(selectedFile);
        }

    });

function createDataVar() {
    console.log("hi2");
    question = Object.keys(dataQuest[0]);// Array com todas as questões


    createAnswer();
    createSetCounter();
    
    //Dá os valores para a variável checkList
    checkList = new Array(question.length);
    for (let i = 0; i < question.length; i++) {
        checkList[i] = true;
    }
    console.log(checkList);

    createGraphs();
}

function createAnswer() {
    answer = new Array(question.length);

    for (var i = 0; i < answer.length; i++) {
        answer[i] = new Array(dataQuest.length);
    }
    for (let i = 0; i < dataQuest.length; i++) {
        for (let j = 0; j < question.length; j++) {
            answer[j][i] = dataQuest[i][question[j]];
        }
    }
}

function createSetCounter() {
    setAnswer = new Array(question.length);
    answerCounter = new Array(question.length);

    for (let number = 0; number < setAnswer.length; number++) {
        setAnswer[number] = [...new Set(answer[number])];
        setAnswer[number].sort(function (a, b) { return a - b });//Colocar as respostas em ordem crescente
        answerCounter[number] = new Array(setAnswer[number].length);
        for (let i = 0; i < answerCounter[number].length; i++) {
            answerCounter[number][i] = 0;
        }
        for (let i = 0; i < setAnswer[number].length; i++) {
            for (let j = 0; j < dataQuest.length; j++) {
                if (answer[number][j] === setAnswer[number][i]) {
                    answerCounter[number][i] += 1;
                }
            }
        }
    }
}

function filterData(filterKey) {

    var indice = -1;

    for (let i = 0; i < setAnswer.length; i++) {
        for (let j = 0; j < setAnswer[i].length; j++) {
            if (setAnswer[i][j] == filterKey) {
                indice = i;
                break
            }
        }
        if(indice > -1){break}
    }

    
    for (let j = 0; j < answer[indice].length; j++) {       
        if (answer[indice][j] != filterKey) {// achar os índices diferentes de filterKey           
            for (let k = 0; k < answer.length; k++) {             
                answer[k].splice(j, 1);//tirar de todos os answers
            }  
            j--;// andar um j para trás para não interferir no for        
        }
    }
    createSetCounter();
}
