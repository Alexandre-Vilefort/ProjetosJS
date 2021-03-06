var selectedFile;
var jsonObject;
var dataQuest;
var number;// número da questão
var question;// array com asquestões em string
var answer;// array com as respostas
var setAnswer;// set com as respostas, unico
var answerCounter;// array com o número de cada resposta

document
    .getElementById("fileUpload")
    .addEventListener("change", function (event) {
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
                //number = Number(prompt(`Informe a questão que deseje gerar o Gráfico`));
                console.log("hi2");
                question = Object.keys(dataQuest[0]);// Array com todas as questões
                answer = new Array(question.length - 1);
                setAnswer = new Array(question.length - 1);
                answerCounter = new Array(question.length - 1);

                for (var i = 0; i < answer.length; i++) {
                    answer[i] = new Array(dataQuest.length);
                }
                for (let i = 0; i < dataQuest.length; i++) {
                    for (let j = 0; j < question.length - 1; j++) {
                        answer[j][i] = dataQuest[i][question[j]];
                    }
                }

                for (let number = 0; number < setAnswer.length; number++) {
                    setAnswer[number] = [...new Set(answer[number])];
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
                createGraphs();
            };
            fileReader.readAsBinaryString(selectedFile);

        }

    });